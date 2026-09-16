import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    console.error('Failed to update booking:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
