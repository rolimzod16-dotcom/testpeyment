import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { capturePayPalOrder } from "@/lib/paypal";
import { generateReceiptNumber } from "@/lib/utils";

const schema = z.object({
  bookingId: z.string(),
  orderId: z.string(),
});

export async function POST(request: Request) {
  try {
    const { bookingId, orderId } = schema.parse(await request.json());

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status === "paid") {
      return NextResponse.json({
        success: true,
        receiptNumber: booking.receiptNumber,
      });
    }

    const capture = await capturePayPalOrder(orderId);
    const paymentId =
      capture.purchase_units[0]?.payments?.captures[0]?.id || capture.id;

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "paid",
        paymentMethod: "card",
        paymentId,
        paypalOrderId: orderId,
        paidAt: new Date(),
        receiptNumber: booking.receiptNumber || generateReceiptNumber(),
      },
    });

    return NextResponse.json({
      success: true,
      bookingRef: updated.bookingRef,
      receiptNumber: updated.receiptNumber,
      paymentId,
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Payment capture failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}