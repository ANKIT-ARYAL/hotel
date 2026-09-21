-- Additive migration for Google guests and service reservations.
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

ALTER TABLE "User" ADD COLUMN "guestId" TEXT;

CREATE TABLE "SpaReservation" (
  "id" TEXT NOT NULL,
  "guestId" TEXT NOT NULL,
  "service" TEXT NOT NULL,
  "scheduledAt" TIMESTAMP(3) NOT NULL,
  "guests" INTEGER NOT NULL DEFAULT 1,
  "notes" TEXT,
  "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SpaReservation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DiningReservation" (
  "id" TEXT NOT NULL,
  "guestId" TEXT NOT NULL,
  "restaurant" TEXT NOT NULL,
  "scheduledAt" TIMESTAMP(3) NOT NULL,
  "guests" INTEGER NOT NULL DEFAULT 2,
  "notes" TEXT,
  "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DiningReservation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_guestId_key" ON "User"("guestId");
ALTER TABLE "User" ADD CONSTRAINT "User_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SpaReservation" ADD CONSTRAINT "SpaReservation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DiningReservation" ADD CONSTRAINT "DiningReservation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
