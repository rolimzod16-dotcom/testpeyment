import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSchema } from "@/lib/ensure-schema";
import { createRampexPaymentLink } from "@/lib/rampex";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

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
      return NextResponse.redirect(`${siteUrl}/payment/${bookingId}?error=1`);
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
    return NextResponse.redirect(`${siteUrl}/payment/${bookingId}?error=1`);
  }
}
