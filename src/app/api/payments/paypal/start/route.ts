import { NextRequest, NextResponse } from "next/server";
import { getLocaleFromCookie, buildLocalizedUrl } from "@/lib/locale-path";
import { getSiteUrl } from "@/lib/site-url";
import { startPayPalPayment } from "@/lib/start-paypal-payment";
import type { PayPalPaymentType } from "@/lib/paypal";

export async function GET(request: NextRequest) {
  const siteUrl = getSiteUrl();
  const locale = getLocaleFromCookie(request.headers.get("cookie"));
  const bookingId = request.nextUrl.searchParams.get("bookingId");
  const typeParam = request.nextUrl.searchParams.get("type");
  const type: PayPalPaymentType = typeParam === "card" ? "card" : "paypal";

  if (!bookingId) {
    return NextResponse.redirect(buildLocalizedUrl(siteUrl, locale, "/?payment=missing_booking"));
  }

  try {
    const approveUrl = await startPayPalPayment(bookingId, type, locale);
    return NextResponse.redirect(approveUrl);
  } catch (error) {
    console.error("PayPal start error:", error);
    return NextResponse.redirect(
      buildLocalizedUrl(siteUrl, locale, `/payment/${bookingId}?error=1`)
    );
  }
}