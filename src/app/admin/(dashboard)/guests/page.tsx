import prisma from "@/lib/db";

import { GuestsClientView } from "./guests-client";


export default async function GuestsPage() {
  const guests = await prisma.guest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      bookings: true,
      spaReservations: { orderBy: { scheduledAt: "desc" } },
      diningReservations: { orderBy: { scheduledAt: "desc" } },
    },
  });

  return <GuestsClientView initialGuests={guests} />;
}
