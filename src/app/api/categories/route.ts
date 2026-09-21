import { requireApiAuth } from "@/lib/api-auth";
import { NextResponse } from "next/server";

import prisma from "@/lib/db";


export async function GET(request: Request) {
  try {
    const data = await prisma.roomCategory.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireApiAuth();
    if (authResult instanceof Response) return authResult;
    const body = await request.json();
    const { name, description, basePrice, amenities, images } = body;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const data = await prisma.roomCategory.create({
      data: {
        name,
        slug,
        description,
        basePrice,
        amenities: {
          connect: (amenities || []).map((id: string) => ({ id })),
        },
        images: {
          create: (images || []).map((url: string) => ({ url })),
        },
      },
      include: {
        images: true,
        amenities: true,
        _count: { select: { rooms: true } },
      },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Failed to create room category:", error);
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
  }
}
