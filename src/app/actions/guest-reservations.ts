"use server";

import { z } from "zod";

import { auth } from "@/lib/auth";
import db from "@/lib/db";

const reservationSchema = z.object({
  scheduledAt: z.string().datetime(),
  guests: z.number().int().min(1).max(20),
  notes: z.string().trim().max(500).optional(),
});

async function getGuestFromSession() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Authentication required");

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  const role = user?.roleId ? await db.role.findUnique({ where: { id: user.roleId } }) : null;
  if (!user || role?.name !== "USER") throw new Error("A guest account is required");

  const guest = await db.guest.upsert({
    where: { email: session.user.email },
    update: { name: session.user.name || "Guest" },
    create: { email: session.user.email, name: session.user.name || "Guest" },
  });
  if (user.guestId !== guest.id) await db.user.update({ where: { id: user.id }, data: { guestId: guest.id } });
  return guest;
}

async function requireStaff() {
  const session = await auth();
  const role = (session?.user?.role as { name?: string } | undefined)?.name;
  if (role !== "ADMIN" && role !== "RECEPTIONIST") throw new Error("Staff access required");
}

export async function updateServiceReservation(input: { type: "spa" | "dining"; id: string; status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" }) {
  const data = z.object({ type: z.enum(["spa", "dining"]), id: z.string().uuid(), status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]) }).parse(input);
  await requireStaff();
  if (data.type === "spa") return db.spaReservation.update({ where: { id: data.id }, data: { status: data.status } });
  return db.diningReservation.update({ where: { id: data.id }, data: { status: data.status } });
}

export async function createSpaReservation(input: z.input<typeof reservationSchema> & { service: string }) {
  const data = reservationSchema.extend({ service: z.string().trim().min(1).max(120) }).parse(input);
  const guest = await getGuestFromSession();
  return db.spaReservation.create({ data: { ...data, scheduledAt: new Date(data.scheduledAt), guestId: guest.id } });
}

export async function createDiningReservation(input: z.input<typeof reservationSchema> & { restaurant: string }) {
  const data = reservationSchema.extend({ restaurant: z.string().trim().min(1).max(120) }).parse(input);
  const guest = await getGuestFromSession();
  return db.diningReservation.create({ data: { ...data, scheduledAt: new Date(data.scheduledAt), guestId: guest.id } });
}

export async function requestCancellation(input: { type: "booking" | "spa" | "dining"; id: string }) {
  const data = z.object({ type: z.enum(["booking", "spa", "dining"]), id: z.string().uuid() }).parse(input);
  const guest = await getGuestFromSession();
  if (data.type === "booking") await db.booking.findFirstOrThrow({ where: { id: data.id, guestId: guest.id } });
  if (data.type === "spa") await db.spaReservation.findFirstOrThrow({ where: { id: data.id, guestId: guest.id } });
  if (data.type === "dining") await db.diningReservation.findFirstOrThrow({ where: { id: data.id, guestId: guest.id } });
  await db.contactMessage.create({ data: { name: guest.name, email: guest.email, subject: `[Cancellation Request] ${data.type}`, message: `CANCELLATION_META:${JSON.stringify(data)}\nGuest requested cancellation for ${data.type}.` } });
  return { success: true };
}
