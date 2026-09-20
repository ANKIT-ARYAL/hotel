import { PrismaClient } from "@prisma/client";

import { RoomsClientView } from "./rooms-client";

const prisma = new PrismaClient();

export default async function RoomsPage() {
  const rooms = await prisma.room.findMany({
    include: { category: true, amenities: true },
    orderBy: { number: "asc" },
  });

  const categories = await prisma.roomCategory.findMany({
    include: { amenities: true },
  });

  const allAmenities = await prisma.amenity.findMany({
    orderBy: { name: "asc" },
  });

  return <RoomsClientView initialRooms={rooms} categories={categories} allAmenities={allAmenities} />;
}
