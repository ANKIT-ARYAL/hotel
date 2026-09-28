"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays, CreditCard, Users, CheckCircle2, BedDouble } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Booking = {
  id: string;
  status: string;
  guest: { name: string };
  room: { number: string };
  checkIn: string;
  checkOut: string;
  totalAmount: number;
};

type FilterType = "ALL" | "UPCOMING" | "PENDING_PAYMENT" | "CHECKED_IN";

export function ReceptionQueue({
  initialBookings,
  totalGuests,
}: {
  initialBookings: Booking[];
  totalGuests: number;
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [saving, setSaving] = useState<string | null>(null);

  const pendingPaymentsCount = bookings.filter((b) => b.status === "PENDING_PAYMENT").length;
  const upcomingCount = bookings.filter((b) => !["CHECKED_OUT", "CANCELLED"].includes(b.status)).length;
  const checkedInCount = bookings.filter((b) => b.status === "CHECKED_IN").length;

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === "UPCOMING") return !["CHECKED_OUT", "CANCELLED"].includes(b.status);
    if (activeFilter === "PENDING_PAYMENT") return b.status === "PENDING_PAYMENT";
    if (activeFilter === "CHECKED_IN") return b.status === "CHECKED_IN";
    return true;
  });

  async function updateStatus(id: string, status: string) {
    setSaving(id);
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Unable to update booking");
      setBookings((items) =>
        items.map((item) => (item.id === id ? { ...item, status } : item)),
      );
      toast.success(
        `Booking marked ${status.toLowerCase().replaceAll("_", " ")}`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update booking",
      );
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveFilter(activeFilter === "ALL" ? "ALL" : "ALL")}
          className={cn(
            "rounded-xl border p-4 sm:p-5 transition-all cursor-pointer select-none",
            activeFilter === "ALL"
              ? "bg-primary/5 border-primary ring-2 ring-primary/20 shadow-sm"
              : "bg-card hover:border-gray-300 hover:shadow-sm"
          )}
        >
          <div className="flex items-center justify-between">
            <CalendarDays className={cn("size-5", activeFilter === "ALL" ? "text-primary" : "text-muted-foreground")} />
            {activeFilter === "ALL" && (
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <p className="mt-3 text-sm text-muted-foreground font-medium">All Bookings</p>
          <p className="text-2xl sm:text-3xl font-semibold text-foreground">{bookings.length}</p>
        </div>

        <div
          onClick={() => setActiveFilter(activeFilter === "UPCOMING" ? "ALL" : "UPCOMING")}
          className={cn(
            "rounded-xl border p-4 sm:p-5 transition-all cursor-pointer select-none",
            activeFilter === "UPCOMING"
              ? "bg-primary/5 border-primary ring-2 ring-primary/20 shadow-sm"
              : "bg-card hover:border-gray-300 hover:shadow-sm"
          )}
        >
          <div className="flex items-center justify-between">
            <BedDouble className={cn("size-5", activeFilter === "UPCOMING" ? "text-blue-600" : "text-muted-foreground")} />
            {activeFilter === "UPCOMING" && (
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Filtered
              </span>
            )}
          </div>
          <p className="mt-3 text-sm text-muted-foreground font-medium">Upcoming Queue</p>
          <p className="text-2xl sm:text-3xl font-semibold text-blue-600">{upcomingCount}</p>
        </div>

        <div
          onClick={() => setActiveFilter(activeFilter === "PENDING_PAYMENT" ? "ALL" : "PENDING_PAYMENT")}
          className={cn(
            "rounded-xl border p-4 sm:p-5 transition-all cursor-pointer select-none",
            activeFilter === "PENDING_PAYMENT"
              ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-sm"
              : "bg-card hover:border-gray-300 hover:shadow-sm"
          )}
        >
          <div className="flex items-center justify-between">
            <CreditCard className={cn("size-5", activeFilter === "PENDING_PAYMENT" ? "text-amber-600" : "text-muted-foreground")} />
            {activeFilter === "PENDING_PAYMENT" && (
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Filtered
              </span>
            )}
          </div>
          <p className="mt-3 text-sm text-muted-foreground font-medium">Payment Follow-up</p>
          <p className="text-2xl sm:text-3xl font-semibold text-amber-600">{pendingPaymentsCount}</p>
        </div>

        <div
          onClick={() => setActiveFilter(activeFilter === "CHECKED_IN" ? "ALL" : "CHECKED_IN")}
          className={cn(
            "rounded-xl border p-4 sm:p-5 transition-all cursor-pointer select-none",
            activeFilter === "CHECKED_IN"
              ? "bg-green-50 border-green-500 ring-2 ring-green-500/20 shadow-sm"
              : "bg-card hover:border-gray-300 hover:shadow-sm"
          )}
        >
          <div className="flex items-center justify-between">
            <CheckCircle2 className={cn("size-5", activeFilter === "CHECKED_IN" ? "text-green-600" : "text-muted-foreground")} />
            {activeFilter === "CHECKED_IN" && (
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Filtered
              </span>
            )}
          </div>
          <p className="mt-3 text-sm text-muted-foreground font-medium">Checked In</p>
          <p className="text-2xl sm:text-3xl font-semibold text-green-600">{checkedInCount}</p>
        </div>
      </div>

      {/* Front Desk Queue Section */}
      <section className="rounded-xl border bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Front desk queue</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Showing {filteredBookings.length} of {bookings.length}
            </span>
            {activeFilter !== "ALL" && (
              <button
                onClick={() => setActiveFilter("ALL")}
                className="text-xs text-primary underline underline-offset-4 hover:opacity-80"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-3">
          {filteredBookings.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p>No bookings match the selected filter.</p>
              <button
                onClick={() => setActiveFilter("ALL")}
                className="mt-2 text-sm text-primary underline"
              >
                Show all bookings
              </button>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="rounded-lg border p-4 hover:border-gray-300 transition-colors">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-medium text-foreground">
                    {booking.guest.name} · Room {booking.room.number}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-full font-semibold",
                      booking.status === "CONFIRMED" && "bg-green-100 text-green-800",
                      booking.status === "PENDING_PAYMENT" && "bg-amber-100 text-amber-800",
                      booking.status === "CHECKED_IN" && "bg-blue-100 text-blue-800",
                      booking.status === "CHECKED_OUT" && "bg-gray-100 text-gray-800",
                      booking.status === "CANCELLED" && "bg-red-100 text-red-800"
                    )}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Check-in {new Date(booking.checkIn).toLocaleDateString()} · Check-out{" "}
                  {new Date(booking.checkOut).toLocaleDateString()} · ${booking.totalAmount.toFixed(2)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {booking.status === "PENDING_PAYMENT" && (
                    <button
                      disabled={saving === booking.id}
                      onClick={() => updateStatus(booking.id, "CONFIRMED")}
                      className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Confirm payment
                    </button>
                  )}
                  {booking.status === "CONFIRMED" && (
                    <button
                      disabled={saving === booking.id}
                      onClick={() => updateStatus(booking.id, "CHECKED_IN")}
                      className="rounded-md border px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      Check in
                    </button>
                  )}
                  {booking.status === "CHECKED_IN" && (
                    <button
                      disabled={saving === booking.id}
                      onClick={() => updateStatus(booking.id, "CHECKED_OUT")}
                      className="rounded-md border px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      Check out
                    </button>
                  )}
                  {!["CHECKED_OUT", "CANCELLED"].includes(booking.status) && (
                    <button
                      disabled={saving === booking.id}
                      onClick={() => updateStatus(booking.id, "CANCELLED")}
                      className="rounded-md border px-3 py-2 text-sm text-destructive hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
