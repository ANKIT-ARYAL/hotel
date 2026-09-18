import { PrismaClient } from "@prisma/client";

import { RolesClientView } from "./roles-client";

const prisma = new PrismaClient();

export default async function RolesPage() {
  const roles = await prisma.role.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { users: true } } },
  });

  return <RolesClientView initialRoles={roles} />;
}
