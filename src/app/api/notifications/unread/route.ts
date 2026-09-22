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
    const pendingReservations = await Promise.all([
      prisma.spaReservation.count({ where: { status: "PENDING" } }),
      prisma.diningReservation.count({ where: { status: "PENDING" } }),
      prisma.experienceReservation.count({ where: { status: "PENDING" } }),
    ]).then((counts) => counts.reduce((total, count) => total + count, 0));

    return NextResponse.json({
      bookings: unreadBookings,
      messages: unreadMessages,
      reservations: pendingReservations,
    });
  } catch (error) {
    console.error("Error fetching unread counts:", error);
    return NextResponse.json({ bookings: 0, messages: 0, reservations: 0 }, { status: 500 });
  }
}
