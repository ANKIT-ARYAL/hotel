import { PrismaClient } from "@prisma/client";

import { AmenitiesClientView } from "./amenities-client";

const prisma = new PrismaClient();

export default async function AmenitiesPage() {
  const amenities = await prisma.amenity.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AmenitiesClientView initialAmenities={amenities} />;
}
