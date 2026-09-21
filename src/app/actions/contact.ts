"use server";

import { headers } from "next/headers";

import { z } from "zod";

import prisma from "@/lib/db";

// Simple in-memory rate limit for server actions
const contactRateLimit = new Map<string, { count: number; resetTime: number }>();
const CONTACT_LIMIT = 3;
const CONTACT_WINDOW = 60_000; // 1 minute

const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{10,15}$/)
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().min(5).optional().or(z.literal("")),
  message: z.string().trim().min(10),
});

export async function submitContact(formData: z.infer<typeof contactSchema>) {
  try {
    // Rate limit check
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const entry = contactRateLimit.get(ip);
    if (entry && now < entry.resetTime && entry.count >= CONTACT_LIMIT) {
      return { success: false, error: "Too many submissions. Please try again later." };
    }
    if (!entry || now >= entry.resetTime) {
      contactRateLimit.set(ip, { count: 1, resetTime: now + CONTACT_WINDOW });
    } else {
      entry.count++;
    }

    const validatedData = contactSchema.parse(formData);

    await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject,
        message: validatedData.message,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation failed: " + error.message };
    }
    return { success: false, error: "Something went wrong while saving your message." };
  }
}
