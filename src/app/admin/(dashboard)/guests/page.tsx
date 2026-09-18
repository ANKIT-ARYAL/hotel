import { PrismaClient } from "@prisma/client";

import { GuestsClientView } from "./guests-client";

const prisma = new PrismaClient();

export default async function GuestsPage() {
  const guests = await prisma.guest.findMany({
    orderBy: { createdAt: "desc" },
    include: { bookings: true },
  });

  return <GuestsClientView initialGuests={guests} />;
}
