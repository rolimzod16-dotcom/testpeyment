import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureSchema } from "@/lib/ensure-schema";
import { calculateDeposit, generateBookingRef } from "@/lib/utils";

const bookingSchema = z.object({
  packageSlug: z.string(),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  country: z.string().optional(),
  guests: z.number().int().min(1).max(20),
  startDate: z.string(),
  specialRequests: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    await ensureSchema();
    const body = await request.json();
    const data = bookingSchema.parse(body);

    const pkg = await prisma.package.findUnique({
      where: { slug: data.packageSlug, active: true },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    if (data.guests > pkg.maxGuests) {
      return NextResponse.json(
        { error: `Maximum ${pkg.maxGuests} guests allowed` },
        { status: 400 }
      );
    }

    const totalAmount = pkg.priceUsd * data.guests;
    const depositAmount = calculateDeposit(totalAmount, pkg.depositPercent);

    const booking = await prisma.booking.create({
      data: {
        bookingRef: generateBookingRef(),
        packageId: pkg.id,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone || null,
        country: data.country || null,
        guests: data.guests,
        startDate: new Date(data.startDate),
        specialRequests: data.specialRequests || null,
        totalAmount,
        depositAmount,
        status: "awaiting_payment",
      },
    });

    return NextResponse.json({
      bookingId: booking.id,
      bookingRef: booking.bookingRef,
      depositAmount: booking.depositAmount,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}