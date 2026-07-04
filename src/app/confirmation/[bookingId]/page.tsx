import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { package: true },
  });

  if (!booking) notFound();
  if (booking.status !== "paid") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-stone-100">Payment Pending</h1>
        <p className="mt-4 text-stone-400">Your booking is awaiting payment.</p>
        <Link
          href={`/payment/${bookingId}`}
          className="mt-6 inline-block rounded-full bg-amber-700 px-6 py-3 font-semibold text-white"
        >
          Continue to Payment
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-emerald-800/50 bg-emerald-950/20 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-700 text-2xl text-white">
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-bold text-stone-100">Booking Confirmed!</h1>
        <p className="mt-3 text-stone-400">
          Thank you, {booking.customerName}. Your deposit has been received and your expedition is
          reserved.
        </p>
      </div>

      <div className="mt-8 space-y-4 rounded-2xl border border-stone-800 bg-stone-900/50 p-6 text-sm">
        <div className="flex justify-between">
          <span className="text-stone-500">Booking Reference</span>
          <span className="font-mono text-stone-200">{booking.bookingRef}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Receipt Number</span>
          <span className="font-mono text-stone-200">{booking.receiptNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Package</span>
          <span className="text-stone-200">{booking.package.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Start Date</span>
          <span className="text-stone-200">{formatDate(booking.startDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Deposit Paid</span>
          <span className="font-semibold text-emerald-400">
            {formatCurrency(booking.depositAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Transaction ID</span>
          <span className="font-mono text-xs text-stone-400">{booking.paymentId}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <a
          href={`/api/receipts/${bookingId}`}
          className="rounded-full bg-amber-700 px-6 py-3 text-center font-semibold text-white hover:bg-amber-600"
        >
          Download PDF Receipt
        </a>
        <Link
          href="/"
          className="rounded-full border border-stone-600 px-6 py-3 text-center font-semibold text-stone-300 hover:border-amber-500"
        >
          Back to Home
        </Link>
      </div>

      <p className="mt-8 text-center text-sm text-stone-500">
        A confirmation has been recorded for {booking.customerEmail}. Remaining balance due before
        departure per booking terms.
      </p>
    </div>
  );
}