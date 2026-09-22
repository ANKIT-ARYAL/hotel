"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getMessages() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return messages;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
}

export async function markMessageAsRead(id: string) {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark message as read:", error);
    return { success: false };
  }
}

export async function deleteMessage(id: string) {
  try {
    await prisma.contactMessage.delete({
      where: { id },
    });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete message:", error);
    return { success: false };
  }
}

export async function resolveCancellationMessage(id: string, approve: boolean) {
  const session = await auth();
  const role = (session?.user?.role as { name?: string } | undefined)?.name;
  if (role !== "ADMIN" && role !== "RECEPTIONIST") throw new Error("Staff access required");
  const message = await prisma.contactMessage.findUniqueOrThrow({ where: { id } });
  if (!message.subject?.startsWith("[Cancellation Request]")) throw new Error("Not a cancellation request");
  const metadata = message.message.match(/^CANCELLATION_META:(\{[\s\S]*\})/)?.[1];
  if (approve && metadata) {
    const request = JSON.parse(metadata) as { type: "booking" | "spa" | "dining" | "experience"; id: string };
    if (request.type === "booking") await prisma.booking.update({ where: { id: request.id }, data: { status: "CANCELLED" } });
    if (request.type === "spa") await prisma.spaReservation.update({ where: { id: request.id }, data: { status: "CANCELLED" } });
    if (request.type === "dining") await prisma.diningReservation.update({ where: { id: request.id }, data: { status: "CANCELLED" } });
    if (request.type === "experience") await prisma.experienceReservation.update({ where: { id: request.id }, data: { status: "CANCELLED" } });
  }
  await prisma.contactMessage.update({ where: { id }, data: { isRead: true, subject: `${approve ? "[Cancellation Approved]" : "[Cancellation Declined]"} ${message.subject.replace(/^\[Cancellation Request\]\s*/, "")}` } });
  revalidatePath("/admin/messages");
  return { success: true };
}
