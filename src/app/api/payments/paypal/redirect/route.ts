import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createPayPalOrder } from "@/lib/paypal";

const schema = z.object({
  bookingId: z.string(),
  paymentType: z.enum(["card", "paypal"]).optional().default("card"),
});

export async function POST(request: Request) {
  try {
    const { bookingId, paymentType } = schema.parse(await request.json());

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

    const { orderId, approveUrl } = await createPayPalOrder({
      depositAmount: booking.depositAmount,
      currency: booking.currency,
      bookingRef: booking.bookingRef,
      bookingId: booking.id,
      description: `${booking.package.title} — Deposit`,
      paymentType,
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { paypalOrderId: orderId },
    });

    return NextResponse.json({ approveUrl });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Failed to start PayPal payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}