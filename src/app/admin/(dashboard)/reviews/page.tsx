import { PrismaClient } from "@prisma/client";

import { ReviewsClientView } from "./reviews-client";

const prisma = new PrismaClient();

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      guest: true,
      booking: {
        include: { room: { include: { category: true } } },
      },
    },
  });

  return <ReviewsClientView initialReviews={reviews} />;
}
