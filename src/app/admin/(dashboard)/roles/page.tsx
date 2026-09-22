import prisma from "@/lib/db";

import { RolesClientView } from "./roles-client";


export default async function RolesPage() {
  await prisma.role.upsert({
    where: { name: "RECEPTIONIST" },
    update: {},
    create: { name: "RECEPTIONIST", permissions: ["Reception", "Dashboard", "Bookings", "Reservations", "Messages", "Rooms", "Guests", "Reviews"] },
  });
  await prisma.role.upsert({ where: { name: "USER" }, update: {}, create: { name: "USER", permissions: [] } });
  const roles = await prisma.role.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { users: true } } },
  });

  return <RolesClientView initialRoles={roles} />;
}
