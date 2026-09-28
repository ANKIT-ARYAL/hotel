"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Sparkles, Utensils, Compass, Clock, CheckCircle2 } from "lucide-react";
import { updateServiceReservation } from "@/app/actions/guest-reservations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Reservation = {
  id: string;
  type: "Spa" | "Dining" | "Experience";
  title: string;
  scheduledAt: Date | string;
  guests: number;
  notes: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  guest: { name: string; email: string };
};

type FilterType = "ALL" | "Spa" | "Dining" | "Experience" | "PENDING";

export function ReservationsClient({ initialReservations }: { initialReservations: Reservation[] }) {
  const [reservations, setReservations] = useState(initialReservations);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  const spaCount = reservations.filter((r) => r.type === "Spa").length;
  const diningCount = reservations.filter((r) => r.type === "Dining").length;
  const experienceCount = reservations.filter((r) => r.type === "Experience").length;
  const pendingCount = reservations.filter((r) => r.status === "PENDING").length;

  const filteredReservations = reservations.filter((item) => {
    if (activeFilter === "Spa") return item.type === "Spa";
    if (activeFilter === "Dining") return item.type === "Dining";
    if (activeFilter === "Experience") return item.type === "Experience";
    if (activeFilter === "PENDING") return item.status === "PENDING";
    return true;
  });

  async function update(item: Reservation, status: "CONFIRMED" | "CANCELLED" | "COMPLETED") {
    const type = item.type === "Spa" ? "spa" : item.type === "Dining" ? "dining" : "experience";
    try {
      await updateServiceReservation({ type, id: item.id, status });
      setReservations((items) =>
        items.map((current) => (current.id === item.id && current.type === item.type ? { ...current, status } : current))
      );
      toast.success(`${item.type} reservation marked ${status.toLowerCase()}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update reservation");
    }
  }

  return (
    <main className="space-y-6 pb-12" data-admin-operations>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-gray-900"
            style={{ fontSize: "var(--admin-heading-size)" }}
          >
            Reservations
          </h1>
          <p className="text-base text-gray-500 mt-1">Manage spa, dining, and experience requests in one place.</p>
        </div>
      </div>

      {/* Top Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          onClick={() => setActiveFilter(activeFilter === "ALL" ? "ALL" : "ALL")}
          className={cn(
            "p-4 sm:p-5 rounded-xl border bg-white cursor-pointer select-none transition-all shadow-sm",
            activeFilter === "ALL"
              ? "border-primary ring-2 ring-primary/20 bg-primary/5"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">All Requests</span>
            {activeFilter === "ALL" && (
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{reservations.length}</p>
        </div>

        <div
          onClick={() => setActiveFilter(activeFilter === "PENDING" ? "ALL" : "PENDING")}
          className={cn(
            "p-4 sm:p-5 rounded-xl border bg-white cursor-pointer select-none transition-all shadow-sm",
            activeFilter === "PENDING"
              ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/40"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Pending</span>
            {activeFilter === "PENDING" && (
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Filtered
              </span>
            )}
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-600 mt-2">{pendingCount}</p>
        </div>

        <div
          onClick={() => setActiveFilter(activeFilter === "Spa" ? "ALL" : "Spa")}
          className={cn(
            "p-4 sm:p-5 rounded-xl border bg-white cursor-pointer select-none transition-all shadow-sm",
            activeFilter === "Spa"
              ? "border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/40"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Spa</span>
            {activeFilter === "Spa" && (
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                Filtered
              </span>
            )}
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-2">{spaCount}</p>
        </div>

        <div
          onClick={() => setActiveFilter(activeFilter === "Dining" ? "ALL" : "Dining")}
          className={cn(
            "p-4 sm:p-5 rounded-xl border bg-white cursor-pointer select-none transition-all shadow-sm",
            activeFilter === "Dining"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Dining</span>
            {activeFilter === "Dining" && (
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Filtered
              </span>
            )}
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2">{diningCount}</p>
        </div>

        <div
          onClick={() => setActiveFilter(activeFilter === "Experience" ? "ALL" : "Experience")}
          className={cn(
            "p-4 sm:p-5 rounded-xl border bg-white cursor-pointer select-none transition-all shadow-sm col-span-2 sm:col-span-1",
            activeFilter === "Experience"
              ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/40"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Experiences</span>
            {activeFilter === "Experience" && (
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Filtered
              </span>
            )}
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">{experienceCount}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          Showing {filteredReservations.length} of {reservations.length} requests
        </span>
        {activeFilter !== "ALL" && (
          <button
            onClick={() => setActiveFilter("ALL")}
            className="text-primary underline underline-offset-4 hover:opacity-80"
          >
            Clear filter
          </button>
        )}
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredReservations.map((item) => (
          <article key={`${item.type}-${item.id}`} className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{item.type}</p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">{item.title}</h2>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  item.status === "CONFIRMED" && "bg-green-100 text-green-800",
                  item.status === "PENDING" && "bg-amber-100 text-amber-800",
                  item.status === "COMPLETED" && "bg-blue-100 text-blue-800",
                  item.status === "CANCELLED" && "bg-red-100 text-red-800"
                )}
              >
                {item.status}
              </span>
            </div>
            <dl className="mt-5 grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Guest</dt>
                <dd className="font-medium text-foreground">{item.guest.name} · {item.guest.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Scheduled</dt>
                <dd className="font-medium text-foreground">{format(new Date(item.scheduledAt), "PPP p")}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Guests</dt>
                <dd className="font-medium text-foreground">{item.guests}</dd>
              </div>
              {item.notes && (
                <div>
                  <dt className="text-muted-foreground">Notes</dt>
                  <dd className="italic text-foreground">{item.notes}</dd>
                </div>
              )}
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.status === "PENDING" && (
                <button
                  className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800 transition-colors"
                  onClick={() => update(item, "CONFIRMED")}
                >
                  Confirm
                </button>
              )}
              {item.status !== "CANCELLED" && (
                <button
                  className="rounded-md border px-3 py-2 text-sm text-destructive hover:bg-red-50 transition-colors"
                  onClick={() => update(item, "CANCELLED")}
                >
                  Cancel
                </button>
              )}
              {item.status === "CONFIRMED" && (
                <button
                  className="rounded-md border px-3 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() => update(item, "COMPLETED")}
                >
                  Complete
                </button>
              )}
            </div>
          </article>
        ))}
        {!filteredReservations.length && (
          <div className="col-span-full rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            <p>No reservations match this filter.</p>
            <button
              onClick={() => setActiveFilter("ALL")}
              className="mt-2 text-sm text-primary underline"
            >
              Show all reservations
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
