import prisma from "@/lib/db";

import { RolesClientView } from "./roles-client";


export default async function RolesPage() {
  const roles = await prisma.role.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { users: true } } },
  });

  return <RolesClientView initialRoles={roles} />;
}
