import { PrismaClient } from "@prisma/client";

import { PromotionsClientView } from "./promotions-client";

const prisma = new PrismaClient();

export default async function PromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <PromotionsClientView initialPromotions={promotions} />;
}
