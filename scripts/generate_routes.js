const fs = require('fs');
const path = require('path');

const models = [
  { name: 'booking', model: 'booking' },
  { name: 'rooms', model: 'room' },
  { name: 'users', model: 'user' },
  { name: 'guests', model: 'guest' },
  { name: 'finance', model: 'transaction' },
  { name: 'analytics', model: 'analyticsEvent' },
  { name: 'settings', model: 'setting' },
  { name: 'roles', model: 'role' },
  { name: 'categories', model: 'roomCategory' },
  { name: 'amenities', model: 'amenity' },
  { name: 'promotions', model: 'promotion' },
  { name: 'reviews', model: 'review' },
  { name: 'images', model: 'image' }
];

const basePath = path.join(process.cwd(), 'src/app/api');

models.forEach(({ name, model }) => {
  const dirPath = path.join(basePath, name);
  const idPath = path.join(dirPath, '[id]');
  
  fs.mkdirSync(idPath, { recursive: true });

  const indexRoute = `import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const data = await prisma.${model}.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await prisma.${model}.create({ data: body });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}
`;

  const idRoute = `import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await prisma.${model}.findUnique({
      where: { id }
    });
    
    if (!data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await prisma.${model}.update({
      where: { id },
      data: body
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.${model}.delete({
      where: { id }
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
`;

  fs.writeFileSync(path.join(dirPath, 'route.ts'), indexRoute);
  fs.writeFileSync(path.join(idPath, 'route.ts'), idRoute);
});

console.log('Successfully generated CRUD routes');
