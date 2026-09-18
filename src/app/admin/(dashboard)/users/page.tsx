import { PrismaClient } from "@prisma/client";

import { UsersClientView } from "./users-client";

const prisma = new PrismaClient();

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { role: true },
  });
  const roles = await prisma.role.findMany();

  return <UsersClientView initialUsers={users} roles={roles} />;
}
