import prisma from "@/lib/db";

import { ReviewsClientView } from "./reviews-client";


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
