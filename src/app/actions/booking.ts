"use server";

import { z } from "zod";

import prisma from "@/lib/db";

const bookingSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(2, "Last name is required"),
  email: z.string().trim().email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  roomId: z.string().uuid("Invalid room"),
  arrival: z.string().datetime(),
  departure: z.string().datetime(),
  paymentMethod: z.enum(["QR", "CREDIT_CARD"]),
  paymentRefId: z.string().optional(),
});

export async function submitBooking(formData: z.infer<typeof bookingSchema>) {
  try {
    const data = bookingSchema.parse(formData);

    // Verify room exists and is available
    const room = await prisma.room.findUnique({
      where: { id: data.roomId },
    });

    if (!room) {
      return { success: false, error: "Room not found" };
    }

    const arrival = new Date(data.arrival);
    const departure = new Date(data.departure);

    // Calculate total
    const nights = Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = nights * room.price;

    // Create or find Guest
    const guest = await prisma.guest.upsert({
      where: { email: data.email },
      update: {
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
      },
      create: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
      },
    });

    // Create Booking
    const booking = await prisma.booking.create({
      data: {
        guestId: guest.id,
        roomId: room.id,
        checkIn: arrival,
        checkOut: departure,
        totalAmount,
        status: "PENDING_PAYMENT",
        paymentMethod: data.paymentMethod,
        paymentRefId: data.paymentRefId,
        paymentAmount: totalAmount,
      },
    });

    return { success: true, bookingId: booking.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation failed" };
    }
    console.error(error);
    return { success: false, error: "Failed to process booking" };
  }
}

import { revalidatePath } from "next/cache";

export async function deleteBooking(id: string) {
  try {
    await prisma.booking.delete({
      where: { id },
    });
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete booking", error);
    return { success: false, error: "Failed to delete booking" };
  }
}
