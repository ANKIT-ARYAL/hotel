import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { z } from 'zod';
import { sendBookingConfirmationEmail } from '@/lib/email';

const createBookingSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  checkIn: z.string(),
  checkOut: z.string(),
  roomId: z.string(),
  totalAmount: z.number(),
  paymentMethod: z.string().optional(),
  paymentRefId: z.string().optional(),
  paymentAmount: z.number().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = createBookingSchema.parse(json);

    // Upsert Guest
    let guest = await prisma.guest.findUnique({
      where: { email: body.email }
    });

    if (!guest) {
      guest = await prisma.guest.create({
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone,
        }
      });
    } else if (body.phone && guest.phone !== body.phone) {
      guest = await prisma.guest.update({
        where: { id: guest.id },
        data: { phone: body.phone }
      });
    }

    // Create Booking
    const booking = await prisma.booking.create({
      data: {
        guestId: guest.id,
        roomId: body.roomId,
        checkIn: new Date(body.checkIn),
        checkOut: new Date(body.checkOut),
        totalAmount: body.totalAmount,
        paymentMethod: body.paymentMethod,
        paymentRefId: body.paymentRefId,
        paymentAmount: body.paymentAmount,
        status: 'PENDING',
      },
      include: {
        room: true,
      }
    });

    // Send confirmation email asynchronously
    sendBookingConfirmationEmail({
      to: guest.email,
      name: guest.name,
      roomNumber: booking.room.number,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      totalAmount: body.totalAmount,
    }).catch(console.error);

    return NextResponse.json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const bookings = await prisma.booking.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        guest: true,
        room: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
