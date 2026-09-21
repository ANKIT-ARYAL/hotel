import { requireApiAuth } from "@/lib/api-auth";
import { NextResponse } from "next/server";

import prisma from "@/lib/db";


export async function GET(request: Request) {
  try {
    const authResult = await requireApiAuth();
    if (authResult instanceof Response) return authResult;
    const data = await prisma.guest.findMany();
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
    const data = await prisma.guest.create({ data: body });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
  }
}
