"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/db";

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
