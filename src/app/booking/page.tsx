import React from "react";

import Link from "next/link";
import { redirect } from "next/navigation";

import { Check } from "lucide-react";

import { BookingForm } from "@/components/booking/BookingForm";
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
  const departureDate = new Date(departure);
  const nights = Math.ceil((departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = nights * room.price;

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col pt-24">
      <div className="bg-zinc-900 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-white mb-4" style={{ fontSize: "var(--theme-heading-size)" }}>
            Complete Your Reservation
          </h1>
          <p className="text-zinc-400 font-oklean text-lg max-w-2xl mx-auto">
            You are one step away from confirming your stay. Please review your details and complete the secure payment.
          </p>
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Order Summary (Left side on desktop, top on mobile) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-zinc-200/50 sticky top-32">
              <h2 className="font-argine text-xl font-bold text-zinc-900 mb-6 border-b pb-4">Reservation Summary</h2>

              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-6 relative">
                <img
                  src={room.image || room.category.images[0]?.url || "/uploads/room-1.jpg"}
                  alt={room.category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                  {room.name || `Room ${room.number}`}
                </div>
              </div>

              <h3 className="font-argine text-xl font-bold text-zinc-900 mb-2">{room.category.name}</h3>
              <p className="text-sm text-zinc-500 mb-6">{guests || 2} Guests</p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start text-sm">
                  <div className="font-medium text-zinc-500">Check-In</div>
                  <div className="font-bold text-zinc-900 text-right">
                    {formatDate(arrivalDate)}
                    <br />
                    <span className="text-xs font-normal text-zinc-500">From 3:00 PM</span>
                  </div>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <div className="font-medium text-zinc-500">Check-Out</div>
                  <div className="font-bold text-zinc-900 text-right">
                    {formatDate(departureDate)}
                    <br />
                    <span className="text-xs font-normal text-zinc-500">Until 11:00 AM</span>
                  </div>
                </div>
                <div className="flex justify-between items-start text-sm pt-4 border-t border-zinc-100">
                  <div className="font-medium text-zinc-500">
                    {nights} {nights === 1 ? "Night" : "Nights"} x ${room.price}
                  </div>
                  <div className="font-bold text-zinc-900">${totalAmount}</div>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-6 mt-2 mb-6">
                <div className="flex justify-between items-end">
                  <div className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Total Due</div>
                  <div className="text-3xl font-bold text-zinc-900">${totalAmount}</div>
                </div>
              </div>

              <p className="text-xs text-zinc-400 text-center">
                By completing this booking, you agree to our{" "}
                <Link href="#" className="underline">
                  Terms & Conditions
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Form (Right side) */}
          <div className="lg:col-span-2">
            <BookingForm roomId={room.id} arrival={arrival} departure={departure} />
          </div>
        </div>
      </main>
    </div>
  );
}
