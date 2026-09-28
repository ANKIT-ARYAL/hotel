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
        <h1
          className="text-3xl font-semibold tracking-tight"
          style={{ fontSize: "var(--admin-heading-size)" }}
        >
          Reception Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage arrivals, departures, guests, and payment follow-up.
        </p>
      </div>

      <ReceptionQueue
        initialBookings={bookings.map((booking) => ({
          ...booking,
          checkIn: booking.checkIn.toISOString(),
          checkOut: booking.checkOut.toISOString(),
        }))}
        totalGuests={guests}
      />
    </div>
  );
}
