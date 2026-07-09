import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureSchema } from "@/lib/ensure-schema";
import { createRampexPaymentLink } from "@/lib/rampex";

const schema = z.object({ bookingId: z.string().min(1) });

export async function POST(request: Request) {
  try {
    await ensureSchema();
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

    const amount =
      booking.currency === "USD" && booking.depositAmount < 1 ? 1 : booking.depositAmount;

    const link = await createRampexPaymentLink({
      amount,
      currency: booking.currency,
      customerEmail: booking.customerEmail,
      description: `${booking.package.title} — Deposit (${booking.bookingRef})`,
      bookingId: booking.id,
      bookingRef: booking.bookingRef,
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentMethod: "rampex",
        // Reuse field as external payment reference (Rampex link_id)
        paypalOrderId: link.linkId,
      },
    });

    return NextResponse.json({
      linkId: link.linkId,
      paymentUrl: link.paymentUrl,
      shortUrl: link.shortUrl,
    });
  } catch (error) {
    console.error("[rampex create-link]", error);
    const message = error instanceof Error ? error.message : "Failed to create Rampex link";
    let code = "RAMPEX_ERROR";
    if (/NO_WALLET|wallet not configured/i.test(message)) code = "NO_WALLET";
    else if (/API key|INVALID_API|UNAUTHORIZED/i.test(message)) code = "API_KEY";
    return NextResponse.json({ error: message, code }, { status: 500 });
  }
}
