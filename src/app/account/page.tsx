import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getHomepageSettings } from "@/app/actions/homepage-settings";
import { getUserDashboardSettings } from "@/app/actions/user-dashboard-settings";
import { handleGuestSignOut } from "@/app/actions/auth";
import db from "@/lib/db";
import { CancelRequestButton } from "@/components/guest/CancelRequestButton";

export default async function GuestAccountPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const sessionRole = session.user.role as unknown as string | { name?: string } | undefined;
  const roleName = typeof sessionRole === "string" ? sessionRole : sessionRole?.name;
  if (roleName !== "USER") redirect("/admin/dashboard");
  const homepage = await getHomepageSettings();
  const dashboard = await getUserDashboardSettings();

  const guest = await db.guest.findUnique({
    where: { email: session.user.email },
    include: {
      bookings: {
        include: { room: { include: { category: true } } },
        orderBy: { createdAt: "desc" },
      },
      spaReservations: { orderBy: { scheduledAt: "desc" } },
      diningReservations: { orderBy: { scheduledAt: "desc" } },
      experienceReservations: { orderBy: { scheduledAt: "desc" } },
    },
  });
  const spaReservations = (guest?.spaReservations ?? []) as Array<{
    id: string;
    service: string;
    scheduledAt: Date;
    status: string;
  }>;
  const diningReservations = (guest?.diningReservations ?? []) as Array<{
    id: string;
    restaurant: string;
    scheduledAt: Date;
    status: string;
  }>;
  const experienceReservations = (guest?.experienceReservations ?? []) as Array<{
    id: string; experience: string; scheduledAt: Date; guests: number; status: string;
  }>;

  return (
    <main className="min-h-screen bg-[#faf9f5] text-zinc-900">
      <section className="relative flex min-h-[480px] items-end overflow-hidden px-6 pb-14 pt-36 md:px-12 lg:px-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${dashboard.hero.image || homepage.hero.image || homepage.hero.backgroundImageFallback})`,
          }}
        />
        <div className="absolute inset-0 bg-black/45" />
        {dashboard.hero.isVisible && (
          <div className="relative z-10 mx-auto flex w-full max-w-7xl items-end justify-between gap-6 text-white">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.25em] text-white/75">
                Guest portal
              </p>
              <h1 className="max-w-3xl text-5xl md:text-[length:var(--theme-heading-size)] font-medium tracking-tight font-[var(--theme-heading-font)]">
                {dashboard.hero.title},{" "}
                {guest?.name || session.user.name || "Guest"}
              </h1>
              <p className="mt-5 max-w-xl text-lg md:text-[length:var(--theme-body-size)] text-white/85 font-[var(--theme-body-font)]">
                {dashboard.hero.subtitle}
              </p>
            </div>
            <form action={handleGuestSignOut}>
              <button
                type="submit"
                className="shrink-0 rounded-sm border border-white/50 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
              >
                Log out
              </button>
            </form>
          </div>
        )}
      </section>
      <div className="mx-auto w-full max-w-7xl space-y-6 px-6 py-12 md:px-12 md:py-16 lg:px-24">
        <div className="grid gap-6 md:grid-cols-3">
          {dashboard.bookings.isVisible && (
            <section className="rounded-sm border border-zinc-200 bg-[#fffdfa] p-6 md:col-span-2 md:p-8">
              <h2 className="text-xl font-semibold">
                {dashboard.bookings.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {dashboard.bookings.description}
              </p>
              <div className="mt-4 grid gap-3">
                {guest?.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-sm border border-zinc-200 p-4"
                  >
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="font-medium">
                        Room {booking.room.number} ·{" "}
                        {booking.room.category.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {booking.status}
                        </span>
                        {!["CANCELLED", "CHECKED_OUT"].includes(
                          booking.status,
                        ) && (
                          <CancelRequestButton type="booking" id={booking.id} />
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {booking.checkIn.toLocaleDateString()} –{" "}
                      {booking.checkOut.toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {!guest?.bookings.length && (
                  <p className="text-muted-foreground">No bookings yet.</p>
                )}
              </div>
            </section>
          )}
          {dashboard.services.isVisible && (
            <section className="rounded-sm border border-zinc-200 bg-[#fffdfa] p-6 md:p-8">
              <h2 className="text-xl font-semibold">
                {dashboard.services.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {dashboard.services.description}
              </p>
              <div className="mt-4 grid gap-3">
                <a
                  className="rounded-sm border border-zinc-200 p-4 hover:bg-zinc-50"
                  href="/spa"
                >
                  Request spa service
                </a>
                <a
                  className="rounded-sm border border-zinc-200 p-4 hover:bg-zinc-50"
                  href="/dining"
                >
                  Reserve dining
                </a>
                <a
                  className="rounded-sm border border-zinc-200 p-4 hover:bg-zinc-50"
                  href="/experiences"
                >
                  Book an experience
                </a>
              </div>
            </section>
          )}
        </div>
        {dashboard.activity.isVisible && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <section className="rounded-sm border border-zinc-200 bg-[#fffdfa] p-6 md:p-8">
              <h2 className="text-xl font-semibold">Spa requests</h2>
              <div className="mt-4 grid gap-3">
                {spaReservations.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-sm border border-zinc-200 p-3"
                  >
                    <p className="font-medium">{item.service}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.scheduledAt.toLocaleString()} · {item.status}
                    </p>
                    {!["CANCELLED", "COMPLETED"].includes(item.status) && (
                      <CancelRequestButton type="spa" id={item.id} />
                    )}
                  </div>
                ))}
                {!spaReservations.length && (
                  <p className="text-sm text-muted-foreground">
                    No spa requests yet.
                  </p>
                )}
              </div>
            </section>
            <section className="rounded-sm border border-zinc-200 bg-[#fffdfa] p-6 md:p-8">
              <h2 className="text-xl font-semibold">Dining requests</h2>
              <div className="mt-4 grid gap-3">
                {diningReservations.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-sm border border-zinc-200 p-3"
                  >
                    <p className="font-medium">{item.restaurant}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.scheduledAt.toLocaleString()} · {item.status}
                    </p>
                    {!["CANCELLED", "COMPLETED"].includes(item.status) && (
                      <CancelRequestButton type="dining" id={item.id} />
                    )}
                  </div>
                ))}
                {!diningReservations.length && (
                  <p className="text-sm text-muted-foreground">
                    No dining requests yet.
                  </p>
                )}
              </div>
            </section>
            <section className="rounded-sm border border-zinc-200 bg-[#fffdfa] p-6 md:p-8">
              <h2 className="text-xl font-semibold">Experience bookings</h2>
              <div className="mt-4 grid gap-3">
                {experienceReservations.map((item) => (
                  <div key={item.id} className="rounded-sm border border-zinc-200 p-3">
                    <p className="font-medium">{item.experience}</p>
                    <p className="text-sm text-muted-foreground">{item.scheduledAt.toLocaleString()} · {item.status}</p>
                    {!['CANCELLED', 'COMPLETED'].includes(item.status) && <CancelRequestButton type="experience" id={item.id} />}
                  </div>
                ))}
                {!experienceReservations.length && <p className="text-sm text-muted-foreground">No experience bookings yet.</p>}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
