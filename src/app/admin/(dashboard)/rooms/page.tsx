import { PrismaClient } from "@prisma/client";

import { RoomsClientView } from "./rooms-client";

const prisma = new PrismaClient();

export default async function RoomsPage() {
  const rooms = await prisma.room.findMany({
    include: { category: true },
    orderBy: { number: "asc" },
  });

  const categories = await prisma.roomCategory.findMany();

  return <RoomsClientView initialRooms={rooms} categories={categories} />;
}
