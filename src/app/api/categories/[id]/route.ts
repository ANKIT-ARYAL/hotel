import { requireApiAuth } from "@/lib/api-auth";
import { NextResponse } from "next/server";

import prisma from "@/lib/db";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await prisma.roomCategory.findUnique({
      where: { id },
    });

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireApiAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    const body = await request.json();
    const { name, description, basePrice, amenities, images } = body;
    const slug = name
      ? name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      : undefined;

    // For updating relations:
    // amenities: use 'set' to replace the connected amenities
    // images: use 'deleteMany' to remove existing ones, then 'create' to add new ones

    const updateData: any = {
      description,
      basePrice,
    };

    if (name) {
      updateData.name = name;
      updateData.slug = slug;
    }

    if (amenities) {
      updateData.amenities = {
        set: amenities.map((amId: string) => ({ id: amId })),
      };
    }

    if (images) {
      updateData.images = {
        deleteMany: {},
        create: images.map((url: string) => ({ url })),
      };
    }

    const data = await prisma.roomCategory.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        amenities: true,
        _count: { select: { rooms: true } },
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to update room category:", error);
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireApiAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    await prisma.roomCategory.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
