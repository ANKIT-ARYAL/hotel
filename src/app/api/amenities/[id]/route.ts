import { requireApiAuth } from "@/lib/api-auth";
import { NextResponse } from "next/server";

import prisma from "@/lib/db";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await prisma.amenity.findUnique({
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
    const data = await prisma.amenity.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireApiAuth();
    if (authResult instanceof Response) return authResult;
    const { id } = await params;
    await prisma.amenity.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
