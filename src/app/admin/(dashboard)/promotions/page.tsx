import prisma from "@/lib/db";

import { PromotionsClientView } from "./promotions-client";


export default async function PromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <PromotionsClientView initialPromotions={promotions} />;
}
