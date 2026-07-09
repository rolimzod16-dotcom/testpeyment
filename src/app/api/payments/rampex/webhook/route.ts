import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSchema } from "@/lib/ensure-schema";
import {
  isRampexPaidStatus,
  verifyRampexWebhookSignature,
} from "@/lib/rampex";
import { generateReceiptNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

type WebhookBody = {
  event?: string;
  payment_link_id?: string;
  link_id?: string;
  status?: string;
  amount?: number;
  received_amount?: number;
  currency?: string;
  customer_email?: string;
  description?: string;
  transaction_hash?: string;
  paid_at?: string;
  woo_order_id?: string;
  ipn_token?: string;
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature =
    request.headers.get("x-webhook-signature") ||
    request.headers.get("X-Webhook-Signature");

  // If secret is configured, require valid HMAC. If not set, accept (dev only).
  const secret = process.env.RAMPEX_WEBHOOK_SECRET?.trim();
  if (secret) {
    if (!verifyRampexWebhookSignature(rawBody, signature)) {
      console.error("[rampex webhook] invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else {
    console.warn("[rampex webhook] RAMPEX_WEBHOOK_SECRET not set — skipping verify");
  }

  let body: WebhookBody;
  try {
    body = JSON.parse(rawBody) as WebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = String(body.event || "").toLowerCase();
  const status = body.status;
  const paid =
    event === "payment.completed" || isRampexPaidStatus(status);

  if (!paid) {
    // Acknowledge non-paid events so Rampex stops retrying
    return NextResponse.json({ ok: true, ignored: true, event, status });
  }

  try {
    await ensureSchema();

    const linkId = body.link_id || body.payment_link_id;
    const bookingRef = body.woo_order_id;
    const bookingIdHint = body.ipn_token;

    let booking =
      (bookingIdHint
        ? await prisma.booking.findUnique({ where: { id: bookingIdHint } })
        : null) ||
      (bookingRef
        ? await prisma.booking.findUnique({ where: { bookingRef } })
        : null) ||
      (linkId
        ? await prisma.booking.findFirst({ where: { paypalOrderId: linkId } })
        : null);

    if (!booking && body.customer_email) {
      booking = await prisma.booking.findFirst({
        where: {
          customerEmail: body.customer_email,
          status: "pending",
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!booking) {
      console.error("[rampex webhook] booking not found", {
        linkId,
        bookingRef,
        bookingIdHint,
      });
      // 200 so Rampex does not retry forever for unknown bookings
      return NextResponse.json({ ok: false, error: "booking_not_found" });
    }

    if (booking.status === "paid") {
      return NextResponse.json({
        ok: true,
        alreadyPaid: true,
        bookingId: booking.id,
      });
    }

    const paymentId =
      body.transaction_hash || linkId || booking.paypalOrderId || booking.id;

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "paid",
        paymentMethod: "rampex",
        paymentId,
        paypalOrderId: linkId || booking.paypalOrderId,
        paidAt: body.paid_at ? new Date(body.paid_at) : new Date(),
        receiptNumber: booking.receiptNumber || generateReceiptNumber(),
      },
    });

    return NextResponse.json({
      ok: true,
      bookingId: updated.id,
      bookingRef: updated.bookingRef,
      receiptNumber: updated.receiptNumber,
    });
  } catch (error) {
    console.error("[rampex webhook]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
