"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { BookingForm } from "./BookingForm";
import { Button } from "@/components/ui/button";

interface RoomCategory {
  name: string;
  images: { url: string }[];
  amenities: { id: string; name: string }[];
}

interface RoomData {
  id: string;
  number: string;
  name?: string | null;
  price: number;
  image?: string | null;
  category: RoomCategory;
}

interface BookingCheckoutViewProps {
  room: RoomData;
  arrival: string;
  departure: string;
  guests?: string;
  nights: number;
  totalAmount: number;
}

export function BookingCheckoutView({
  room,
  arrival,
  departure,
  guests,
  nights,
  totalAmount,
}: BookingCheckoutViewProps) {
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const router = useRouter();

  const arrivalDate = new Date(arrival);
  const departureDate = new Date(departure);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  const handleBookingSuccess = (id: string) => {
    setConfirmedBookingId(id);
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Dynamic Top Banner */}
      <div className="bg-zinc-900 py-12 md:py-16 px-6">
        <div className="w-full max-w-4xl mx-auto text-center">
          {confirmedBookingId ? (
            <div className="animate-in fade-in duration-500 flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold mb-2">Reservation Verified</p>
              <h1 className="text-white mb-4 text-3xl md:text-5xl font-argine" style={{ fontSize: "var(--theme-heading-size)" }}>
                Booking Confirmed!
              </h1>
              <p className="text-zinc-300 font-oklean text-base md:text-lg max-w-xl mx-auto">
                Your reservation has been confirmed. Full details and receipt have been dispatched to your email address.
              </p>
            </div>
          ) : (
            <div>
              <h1 className="text-white mb-4" style={{ fontSize: "var(--theme-heading-size)" }}>
                Complete Your Reservation
              </h1>
              <p className="text-zinc-400 font-oklean text-lg max-w-2xl mx-auto">
                You are one step away from confirming your stay. Please review your details and complete the secure payment.
              </p>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 md:py-16">
        {/* If confirmed, show confirmation card prominently at the top */}
        {confirmedBookingId ? (
          <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-zinc-200/50 flex flex-col items-center text-center border border-zinc-100">
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl px-8 py-5 mb-8 w-full max-w-md">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Booking Reference</p>
                <p className="text-2xl font-mono font-bold text-zinc-900 tracking-wider">
                  {confirmedBookingId.slice(0, 8).toUpperCase()}
                </p>
              </div>

              <div className="w-full border-t border-zinc-100 pt-6 mb-8 text-left space-y-3 text-sm text-zinc-600">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Room</span>
                  <span className="font-semibold text-zinc-900">{room.name || `Room ${room.number}`} ({room.category.name})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Dates</span>
                  <span className="font-semibold text-zinc-900">{formatDate(arrivalDate)} – {formatDate(departureDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total Paid</span>
                  <span className="font-bold text-zinc-900 text-base">${totalAmount}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Button
                  onClick={() => router.push("/")}
                  className="bg-zinc-900 text-white hover:bg-zinc-800 h-12 px-8 rounded-full font-medium"
                >
                  Return to Home
                </Button>
                <Button
                  onClick={() => router.push("/account")}
                  variant="outline"
                  className="h-12 px-8 rounded-full font-medium"
                >
                  View in Account
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Order Summary (Top on mobile, left on desktop) */}
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
              <BookingForm
                roomId={room.id}
                arrival={arrival}
                departure={departure}
                onSuccess={handleBookingSuccess}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
