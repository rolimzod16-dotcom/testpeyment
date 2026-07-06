import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PayPalPaymentOptions } from "@/components/PayPalPaymentOptions";
import { validatePayPalEnv } from "@/lib/paypal-config";
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

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-[hsl(35,65%,45%)]">
          Step 2 of 2
        </p>
        <h1 className="font-serif mt-2 text-3xl font-light text-[hsl(218,55%,12%)] md:text-4xl">
          Complete Your Payment
        </h1>
        <p className="mt-2 text-[hsl(218,55%,12%)]/65">
          Booking reference:{" "}
          <span className="font-mono text-[hsl(218,55%,12%)]">{booking.bookingRef}</span>
        </p>
        <p className="mt-2 inline-block bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
          ✓ Live PayPal — реальные платежи
        </p>

        {query.cancelled && (
          <p className="mt-4 bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200">
            Payment cancelled. You can try again below.
          </p>
        )}
        {query.error && (
          <div className="mt-4 bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
            <p className="font-semibold">Payment failed</p>
            <p className="mt-1">Please try again or use a different payment method.</p>
          </div>
        )}

        <div className="mt-8 border border-[hsl(218,55%,12%)]/10 bg-white p-6 shadow-sm">
          <h2 className="font-serif font-medium text-[hsl(218,55%,12%)]">Booking Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[hsl(218,55%,12%)]/50">Package</dt>
              <dd className="text-[hsl(218,55%,12%)]">{booking.package.title}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[hsl(218,55%,12%)]/50">Guest</dt>
              <dd className="text-[hsl(218,55%,12%)]">{booking.customerName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[hsl(218,55%,12%)]/50">Start Date</dt>
              <dd className="text-[hsl(218,55%,12%)]">{formatDate(booking.startDate)}</dd>
            </div>
            <div className="flex justify-between border-t border-[hsl(218,55%,12%)]/10 pt-2 font-semibold">
              <dt className="text-[hsl(35,65%,45%)]">Deposit Due Now</dt>
              <dd className="text-[hsl(35,65%,45%)]">{amountLabel}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 border border-[hsl(218,55%,12%)]/10 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-medium text-[hsl(218,55%,12%)]">
            Choose Payment Method
          </h2>
          <p className="mt-1 text-sm text-[hsl(218,55%,12%)]/65">
            {booking.package.title} — {amountLabel}
          </p>

          {!paypalConfig.ok ? (
            <div className="mt-4 bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
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
          <p className="mt-4 text-xs text-[hsl(218,55%,12%)]/40">Return URL: {getSiteUrl()}</p>
        )}
      </div>
    </div>
  );
}