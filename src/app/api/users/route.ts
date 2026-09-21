import { requireApiAuth } from "@/lib/api-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";


export async function GET(request: Request) {
  try {
    const authResult = await requireApiAuth();
    if (authResult instanceof Response) return authResult;
    const data = await prisma.user.findMany();
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
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    const data = await prisma.user.create({ data: body });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
  }
}
