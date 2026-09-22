import { CalendarDays, CreditCard, Users } from "lucide-react";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { ReceptionQueue } from "./ReceptionQueue";

export default async function ReceptionPage() {
  const session = await auth();
  const roleName = (session?.user?.role as { name?: string } | undefined)?.name;
  if (roleName !== "ADMIN" && roleName !== "RECEPTIONIST")
    return <p>Access denied.</p>;

  const [bookings, guests, pendingPayments] = await Promise.all([
    db.booking.findMany({
      include: { guest: true, room: true },
      orderBy: { checkIn: "asc" },
      take: 12,
    }),
    db.guest.count(),
    db.booking.count({ where: { status: "PENDING_PAYMENT" } }),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-12">
      <div>
        <p className="text-sm text-muted-foreground">Front desk workspace</p>
        <h1 className="text-3xl font-semibold">Reception Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Manage arrivals, departures, guests, and payment follow-up.
        </p>
      </div>
      <div className="hidden flex-row items-stretch gap-4 md:flex">
        <div className="min-w-0 flex-1 rounded-xl border bg-card p-5">
          <CalendarDays className="size-5 text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">
            Upcoming bookings
          </p>
          <p className="text-3xl font-semibold">{bookings.length}</p>
        </div>
        <div className="min-w-0 flex-1 rounded-xl border bg-card p-5">
          <Users className="size-5 text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Guest profiles</p>
          <p className="text-3xl font-semibold">{guests}</p>
        </div>
        <div className="min-w-0 flex-1 rounded-xl border bg-card p-5">
          <CreditCard className="size-5 text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">
            Payment follow-up
          </p>
          <p className="text-3xl font-semibold">{pendingPayments}</p>
        </div>
      </div>
      <section className="rounded-xl border bg-card p-4 sm:p-6">
        <h2 className="text-xl font-semibold">Front desk queue</h2>
        <ReceptionQueue
          initialBookings={bookings.map((booking) => ({
            ...booking,
            checkIn: booking.checkIn.toISOString(),
            checkOut: booking.checkOut.toISOString(),
          }))}
        />
      </section>
    </div>
  );
}
