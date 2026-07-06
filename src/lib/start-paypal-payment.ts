import { prisma } from "@/lib/prisma";
import { createPayPalOrder, type PayPalPaymentType } from "@/lib/paypal";

export async function startPayPalPayment(
  bookingId: string,
  paymentType: PayPalPaymentType,
  locale = "en"
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { package: true },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status === "paid") {
    throw new Error("Already paid");
  }

  const { orderId, approveUrl } = await createPayPalOrder({
    depositAmount: booking.depositAmount,
    currency: booking.currency,
    bookingRef: booking.bookingRef,
    bookingId: booking.id,
    description: `${booking.package.title} — Deposit`,
    paymentType,
    locale,
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { paypalOrderId: orderId },
  });

  return approveUrl;
}