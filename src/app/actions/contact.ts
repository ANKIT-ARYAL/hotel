"use server";

import { z } from "zod";

import prisma from "@/lib/db";

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
