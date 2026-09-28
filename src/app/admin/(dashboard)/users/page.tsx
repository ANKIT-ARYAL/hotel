import prisma from "@/lib/db";

import { UsersClientView } from "./users-client";


export default async function UsersPage() {
  const users = await prisma.user.findMany({
    where: {
      guestId: null,
      NOT: {
        role: {
          name: "USER",
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: { role: true },
  });
  const roles = await prisma.role.findMany({
    where: {
      NOT: {
        name: "USER",
      },
    },
  });

  return <UsersClientView initialUsers={users} roles={roles} />;
}
