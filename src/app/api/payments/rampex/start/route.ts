import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSchema } from "@/lib/ensure-schema";
import { createRampexPaymentLink } from "@/lib/rampex";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

function paymentErrorRedirect(siteUrl: string, bookingId: string, code: string, detail?: string) {
  const url = new URL(`${siteUrl}/payment/${bookingId}`);
  url.searchParams.set("error", "1");
  url.searchParams.set("code", code);
  if (detail) url.searchParams.set("detail", detail.slice(0, 180));
  return NextResponse.redirect(url.toString());
}

export async function GET(request: Request) {
  const siteUrl = getSiteUrl();
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("bookingId");

  if (!bookingId) {
    return NextResponse.redirect(`${siteUrl}/?error=missing_booking`);
  }

  try {
    await ensureSchema();
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { package: true },
    });

    if (!booking) {
      return paymentErrorRedirect(siteUrl, bookingId, "NOT_FOUND");
    }
    if (booking.status === "paid") {
      return NextResponse.redirect(`${siteUrl}/confirmation/${bookingId}`);
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
        paypalOrderId: link.linkId,
      },
    });

    return NextResponse.redirect(link.paymentUrl);
  } catch (error) {
    console.error("[rampex start]", error);
    const message = error instanceof Error ? error.message : "Rampex error";
    let code = "RAMPEX_ERROR";
    if (/NO_WALLET|wallet not configured/i.test(message)) code = "NO_WALLET";
    else if (/API key|INVALID_API|UNAUTHORIZED/i.test(message)) code = "API_KEY";
    else if (/minimum|MIN/i.test(message)) code = "MIN_AMOUNT";
    return paymentErrorRedirect(siteUrl, bookingId, code, message);
  }
}
