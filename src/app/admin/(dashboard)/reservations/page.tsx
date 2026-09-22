import prisma from "@/lib/db";
import { ReservationsClient } from "./reservations-client";

export default async function ReservationsPage() {
  const [spa, dining, experiences] = await Promise.all([
    prisma.spaReservation.findMany({ include: { guest: true }, orderBy: { createdAt: "desc" } }),
    prisma.diningReservation.findMany({ include: { guest: true }, orderBy: { createdAt: "desc" } }),
    prisma.experienceReservation.findMany({ include: { guest: true }, orderBy: { createdAt: "desc" } }),
  ]);
  const reservations = [
    ...spa.map((item) => ({ ...item, type: "Spa" as const, title: item.service })),
    ...dining.map((item) => ({ ...item, type: "Dining" as const, title: item.restaurant })),
    ...experiences.map((item) => ({ ...item, type: "Experience" as const, title: item.experience })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return <ReservationsClient initialReservations={reservations} />;
}
