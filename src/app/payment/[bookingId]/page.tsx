import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PayPalPaymentOptions } from "@/components/PayPalPaymentOptions";
import { isPayPalLive, validatePayPalEnv } from "@/lib/paypal-config";
import { getSiteUrl } from "@/lib/site-url";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

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

  const chargeAmount =
    booking.currency === "USD" && booking.depositAmount < 1 ? 1 : booking.depositAmount;
  const amountLabel = formatCurrency(chargeAmount, booking.currency);
  const paypalConfig = validatePayPalEnv();
  const live = isPayPalLive();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm uppercase tracking-wider text-amber-500">Step 2 of 2</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-100">Complete Your Payment</h1>
      <p className="mt-2 text-stone-400">
        Booking reference: <span className="font-mono text-stone-200">{booking.bookingRef}</span>
      </p>
      {live && (
        <p className="mt-2 inline-block rounded-full bg-emerald-900/40 px-3 py-1 text-xs font-medium text-emerald-300">
          Live PayPal
        </p>
      )}

      {query.cancelled && (
        <p className="mt-4 rounded-lg bg-amber-950/40 px-3 py-2 text-sm text-amber-300">
          Payment cancelled. You can try again below.
        </p>
      )}
      {query.error && (
        <div className="mt-4 rounded-lg bg-red-950/40 px-4 py-3 text-sm text-red-300">
          <p className="font-semibold">Payment failed</p>
          <p className="mt-1">Please try again or use a different payment method.</p>
        </div>
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
          <div className="flex justify-between border-t border-stone-800 pt-2 font-semibold">
            <dt className="text-amber-500">Deposit Due Now</dt>
            <dd className="text-amber-400">{amountLabel}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-800 bg-stone-900/70 p-6">
        <h2 className="text-xl font-semibold text-stone-100">Choose Payment Method</h2>
        <p className="mt-1 text-sm text-stone-400">
          {booking.package.title} — {amountLabel}
        </p>

        {!paypalConfig.ok ? (
          <div className="mt-4 rounded-lg bg-red-950/50 px-4 py-3 text-sm text-red-300">
            <p className="font-semibold">PayPal not configured for {paypalConfig.mode} mode</p>
            <ul className="mt-2 list-disc pl-5">
              {paypalConfig.issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
        ) : (
          <PayPalPaymentOptions bookingId={booking.id} amountLabel={amountLabel} />
        )}
      </div>

      {process.env.NODE_ENV === "development" && (
        <p className="mt-4 text-xs text-stone-600">Return URL: {getSiteUrl()}</p>
      )}
    </div>
  );
}