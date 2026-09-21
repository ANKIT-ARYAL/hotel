import prisma from "@/lib/db";

import { UsersClientView } from "./users-client";


export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { role: true },
  });
  const roles = await prisma.role.findMany();

  return <UsersClientView initialUsers={users} roles={roles} />;
}
