import { PrismaClient } from "@prisma/client";

import { CategoriesClientView } from "./categories-client";

const prisma = new PrismaClient();

export default async function CategoriesPage() {
  const categories = await prisma.roomCategory.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      amenities: true,
      images: true,
      _count: { select: { rooms: true } },
    },
  });

  const allAmenities = await prisma.amenity.findMany();

  return <CategoriesClientView initialCategories={categories} allAmenities={allAmenities} />;
}
