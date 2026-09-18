import prisma from "@/lib/db";

import { BookingsClient } from "./bookings-client";

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      guest: true,
      room: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <BookingsClient initialBookings={bookings} />;
}
