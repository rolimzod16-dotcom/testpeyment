import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createPayPalOrder } from "@/lib/paypal";

const schema = z.object({ bookingId: z.string() });

export async function POST(request: Request) {
  try {
    const { bookingId } = schema.parse(await request.json());

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { package: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status === "paid") {
      return NextResponse.json({ error: "Already paid" }, { status: 400 });
    }

    const { orderId } = await createPayPalOrder({
      depositAmount: booking.depositAmount,
      currency: booking.currency,
      bookingRef: booking.bookingRef,
      bookingId: booking.id,
      description: `${booking.package.title} — Deposit`,
      paymentType: "inline-card",
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { paypalOrderId: orderId },
    });

    return NextResponse.json({ orderId });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Failed to create PayPal order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}