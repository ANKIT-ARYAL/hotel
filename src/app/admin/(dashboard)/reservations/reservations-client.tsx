"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { updateServiceReservation } from "@/app/actions/guest-reservations";

type Reservation = { id: string; type: "Spa" | "Dining" | "Experience"; title: string; scheduledAt: Date | string; guests: number; notes: string | null; status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"; guest: { name: string; email: string } };

export function ReservationsClient({ initialReservations }: { initialReservations: Reservation[] }) {
  const [reservations, setReservations] = useState(initialReservations);
  async function update(item: Reservation, status: "CONFIRMED" | "CANCELLED" | "COMPLETED") {
    const type = item.type === "Spa" ? "spa" : item.type === "Dining" ? "dining" : "experience";
    try { await updateServiceReservation({ type, id: item.id, status }); setReservations((items) => items.map((current) => current.id === item.id && current.type === item.type ? { ...current, status } : current)); toast.success(`${item.type} reservation ${status.toLowerCase()}`); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Unable to update reservation"); }
  }
  return <main className="space-y-6 p-4 sm:p-6 lg:p-8" data-admin-operations>
    <div><h1 className="text-3xl font-semibold">Reservations</h1><p className="mt-1 text-muted-foreground">Manage spa, dining, and experience requests in one place.</p></div>
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{reservations.map((item) => <article key={`${item.type}-${item.id}`} className="rounded-xl border bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{item.type}</p><h2 className="mt-1 text-xl font-semibold">{item.title}</h2></div><span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{item.status}</span></div><dl className="mt-5 grid gap-3 text-sm"><div><dt className="text-muted-foreground">Guest</dt><dd>{item.guest.name} · {item.guest.email}</dd></div><div><dt className="text-muted-foreground">Scheduled</dt><dd>{format(new Date(item.scheduledAt), "PPP p")}</dd></div><div><dt className="text-muted-foreground">Guests</dt><dd>{item.guests}</dd></div>{item.notes && <div><dt className="text-muted-foreground">Notes</dt><dd>{item.notes}</dd></div>}</dl><div className="mt-5 flex flex-wrap gap-2">{item.status === "PENDING" && <button className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white" onClick={() => update(item, "CONFIRMED")}>Confirm</button>}{item.status !== "CANCELLED" && <button className="rounded-md border px-3 py-2 text-sm" onClick={() => update(item, "CANCELLED")}>Cancel</button>}{item.status === "CONFIRMED" && <button className="rounded-md border px-3 py-2 text-sm" onClick={() => update(item, "COMPLETED")}>Complete</button>}</div></article>)}{!reservations.length && <p className="rounded-xl border border-dashed p-8 text-muted-foreground">No reservations yet.</p>}</section>
  </main>;
}
