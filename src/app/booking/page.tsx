import React from "react";
import { redirect } from "next/navigation";

import { BookingCheckoutView } from "@/components/booking/BookingCheckoutView";
import prisma from "@/lib/db";

export const metadata = {
  title: "Secure Checkout | The Hotel",
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ roomId?: string; arrival?: string; departure?: string; guests?: string }>;
}) {
  const { roomId, arrival, departure, guests } = await searchParams;

  if (!roomId || !arrival || !departure) {
    redirect("/search");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [arrY, arrM, arrD] = arrival.split("-").map(Number);
  const arrivalCheck = arrY && arrM && arrD ? new Date(arrY, arrM - 1, arrD) : new Date(arrival);
  const departureDate = new Date(departure);
  if (arrivalCheck < today || departureDate <= arrivalCheck) {
    redirect("/search");
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      category: {
        include: {
          images: true,
          amenities: true,
        },
      },
    },
  });

  if (!room) {
    redirect("/search");
  }

  const arrivalDate = new Date(arrival);
  const nights = Math.ceil((departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = nights * room.price;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col pt-24">
      <BookingCheckoutView
        room={room}
        arrival={arrival}
        departure={departure}
        guests={guests}
        nights={nights}
        totalAmount={totalAmount}
      />
    </div>
  );
}
