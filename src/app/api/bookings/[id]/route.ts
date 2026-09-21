import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiAuth } from "@/lib/api-auth";
import prisma from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireApiAuth();
    if (authResult instanceof Response) return authResult;
    const roleName = (authResult.user?.role as { name?: string } | undefined)?.name;
    if (roleName !== "ADMIN" && roleName !== "RECEPTIONIST") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id } = await params;
    const body = await req.json();
    const status = z.enum(["PENDING_PAYMENT", "PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"]).parse(body.status);

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error: unknown) {
    console.error("Failed to update booking:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
