import prisma from "@/lib/db";

import { AmenitiesClientView } from "./amenities-client";


export default async function AmenitiesPage() {
  const amenities = await prisma.amenity.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AmenitiesClientView initialAmenities={amenities} />;
}
