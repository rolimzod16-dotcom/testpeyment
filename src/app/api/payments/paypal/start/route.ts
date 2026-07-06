import { NextRequest, NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site-url";
import { startPayPalPayment } from "@/lib/start-paypal-payment";
import type { PayPalPaymentType } from "@/lib/paypal";

export async function GET(request: NextRequest) {
  const siteUrl = getSiteUrl();
  const bookingId = request.nextUrl.searchParams.get("bookingId");
  const type = "card";

  if (!bookingId) {
    return NextResponse.redirect(`${siteUrl}/?payment=missing_booking`);
  }

  try {
    const approveUrl = await startPayPalPayment(bookingId, type as PayPalPaymentType);
    return NextResponse.redirect(approveUrl);
  } catch (error) {
    console.error("PayPal start error:", error);
    const message = error instanceof Error ? error.message : "payment_failed";
    return NextResponse.redirect(
      `${siteUrl}/payment/${bookingId}?error=1&reason=${encodeURIComponent(message)}`
    );
  }
}