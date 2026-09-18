import { NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function GET() {
  try {
    const unreadBookings = await prisma.booking.count({
      where: { isRead: false },
    });

    const unreadMessages = await prisma.contactMessage.count({
      where: { isRead: false },
    });

    return NextResponse.json({
      bookings: unreadBookings,
      messages: unreadMessages,
    });
  } catch (error) {
    console.error("Error fetching unread counts:", error);
    return NextResponse.json({ bookings: 0, messages: 0 }, { status: 500 });
  }
}
