import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { capturePayPalOrder } from "@/lib/paypal";
import { generateReceiptNumber } from "@/lib/utils";
import { getSiteUrl } from "@/lib/site-url";

export async function GET(request: NextRequest) {
  const siteUrl = getSiteUrl();
  const bookingId = request.nextUrl.searchParams.get("bookingId");
  const token = request.nextUrl.searchParams.get("token");

  if (!bookingId || !token) {
    return NextResponse.redirect(`${siteUrl}/?payment=missing_params`);
  }

  try {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      return NextResponse.redirect(`${siteUrl}/?payment=booking_not_found`);
    }

    if (booking.status !== "paid") {
      const capture = await capturePayPalOrder(token);
      const paymentId =
        capture.purchase_units[0]?.payments?.captures[0]?.id || capture.id;

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "paid",
          paymentMethod: "paypal",
          paymentId,
          paypalOrderId: token,
          paidAt: new Date(),
          receiptNumber: booking.receiptNumber || generateReceiptNumber(),
        },
      });
    }

    return NextResponse.redirect(`${siteUrl}/confirmation/${bookingId}`);
  } catch (error) {
    console.error("PayPal return error:", error);
    return NextResponse.redirect(`${siteUrl}/payment/${bookingId}?error=1`);
  }
}