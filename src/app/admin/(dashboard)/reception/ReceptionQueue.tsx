"use client";

import { useState } from "react";
import { toast } from "sonner";

type Booking = { id: string; status: string; guest: { name: string }; room: { number: string }; checkIn: string; checkOut: string; totalAmount: number };

export function ReceptionQueue({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [saving, setSaving] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setSaving(id);
    try {
      const response = await fetch(`/api/bookings/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (!response.ok) throw new Error("Unable to update booking");
      setBookings((items) => items.map((item) => item.id === id ? { ...item, status } : item));
      toast.success(`Booking marked ${status.toLowerCase().replaceAll("_", " ")}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update booking");
    } finally { setSaving(null); }
  }

  return <div className="mt-4 grid gap-3">{bookings.map((booking) => <div key={booking.id} className="rounded-lg border p-4"><div className="flex flex-wrap justify-between gap-2"><span className="font-medium">{booking.guest.name} · Room {booking.room.number}</span><span className="text-sm text-muted-foreground">{booking.status}</span></div><p className="mt-2 text-sm text-muted-foreground">Check-in {new Date(booking.checkIn).toLocaleDateString()} · Check-out {new Date(booking.checkOut).toLocaleDateString()} · ${booking.totalAmount.toFixed(2)}</p><div className="mt-3 flex flex-wrap gap-2">{booking.status === "PENDING_PAYMENT" && <button disabled={saving === booking.id} onClick={() => updateStatus(booking.id, "CONFIRMED")} className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">Confirm payment</button>}{booking.status === "CONFIRMED" && <button disabled={saving === booking.id} onClick={() => updateStatus(booking.id, "CHECKED_IN")} className="rounded-md border px-3 py-2 text-sm">Check in</button>}{booking.status === "CHECKED_IN" && <button disabled={saving === booking.id} onClick={() => updateStatus(booking.id, "CHECKED_OUT")} className="rounded-md border px-3 py-2 text-sm">Check out</button>}{!["CHECKED_OUT", "CANCELLED"].includes(booking.status) && <button disabled={saving === booking.id} onClick={() => updateStatus(booking.id, "CANCELLED")} className="rounded-md border px-3 py-2 text-sm text-destructive">Cancel</button>}</div></div>)}</div>;
}
