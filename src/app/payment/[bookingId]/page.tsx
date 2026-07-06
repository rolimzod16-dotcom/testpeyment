import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PayPalCheckout } from "@/components/PayPalCheckout";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ cancelled?: string; error?: string }>;
}) {
  const { bookingId } = await params;
  const query = await searchParams;
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { package: true },
  });

  if (!booking) notFound();
  if (booking.status === "paid") redirect(`/confirmation/${bookingId}`);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm uppercase tracking-wider text-amber-500">Step 2 of 2</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-100">Complete Your Payment</h1>
      <p className="mt-2 text-stone-400">
        Booking reference: <span className="font-mono text-stone-200">{booking.bookingRef}</span>
      </p>

      {query.cancelled && (
        <p className="mt-4 rounded-lg bg-amber-950/40 px-3 py-2 text-sm text-amber-300">
          Payment cancelled. You can try again below.
        </p>
      )}
      {query.error && (
        <p className="mt-4 rounded-lg bg-red-950/40 px-3 py-2 text-sm text-red-300">
          Payment failed after PayPal redirect. Try again or use a Sandbox test buyer account.
        </p>
      )}

      <div className="mt-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
        <h2 className="font-semibold text-stone-200">Booking Summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-500">Package</dt>
            <dd className="text-stone-200">{booking.package.title}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">Guest</dt>
            <dd className="text-stone-200">{booking.customerName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">Start Date</dt>
            <dd className="text-stone-200">{formatDate(booking.startDate)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">Guests</dt>
            <dd className="text-stone-200">{booking.guests}</dd>
          </div>
          <div className="flex justify-between border-t border-stone-800 pt-2">
            <dt className="text-stone-500">Total</dt>
            <dd className="text-stone-200">{formatCurrency(booking.totalAmount)}</dd>
          </div>
          <div className="flex justify-between font-semibold">
            <dt className="text-amber-500">Deposit Due Now</dt>
            <dd className="text-amber-400">{formatCurrency(booking.depositAmount)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8">
        <PayPalCheckout
          bookingId={booking.id}
          depositAmount={booking.depositAmount}
          currency={booking.currency}
          packageTitle={booking.package.title}
        />
      </div>
    </div>
  );
}