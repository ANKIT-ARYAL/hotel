import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const data = await prisma.user.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await prisma.user.create({ data: body });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}
