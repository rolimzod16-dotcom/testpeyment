import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GuestCardCheckout } from "@/components/GuestCardCheckout";
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
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm uppercase tracking-wider text-amber-500">Шаг 2 из 2</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-100">Оплата картой</h1>
      <p className="mt-2 text-stone-400">
        Номер: <span className="font-mono text-stone-200">{booking.bookingRef}</span>
      </p>

      {query.cancelled && (
        <p className="mt-4 rounded-lg bg-amber-950/40 px-3 py-2 text-sm text-amber-300">
          Оплата отменена. Попробуйте снова.
        </p>
      )}
      {query.error && (
        <div className="mt-4 rounded-lg bg-red-950/40 px-4 py-3 text-sm text-red-300">
          <p className="font-semibold">Оплата не прошла</p>
          <p className="mt-1">
            На странице PayPal нажмите <strong>«Pay with Debit or Credit Card»</strong> — не входите
            в аккаунт и не регистрируйтесь.
          </p>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-stone-800 bg-stone-900/50 p-6">
        <h2 className="font-semibold text-stone-200">Детали</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-500">Тур</dt>
            <dd className="text-stone-200">{booking.package.title}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">Гость</dt>
            <dd className="text-stone-200">{booking.customerName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-500">Дата</dt>
            <dd className="text-stone-200">{formatDate(booking.startDate)}</dd>
          </div>
          <div className="flex justify-between border-t border-stone-800 pt-2 font-semibold">
            <dt className="text-amber-500">К оплате</dt>
            <dd className="text-amber-400">{amountLabel}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-800 bg-stone-900/70 p-6">
        <h2 className="text-xl font-semibold text-stone-100">Гостевая оплата картой</h2>
        <p className="mt-1 text-sm text-stone-400">
          Клиент платит картой. Регистрация PayPal не требуется. Деньги — на ваш бизнес-аккаунт.
        </p>

        {!clientId ? (
          <p className="mt-4 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">
            PayPal не настроен. Добавьте NEXT_PUBLIC_PAYPAL_CLIENT_ID в Vercel.
          </p>
        ) : (
          <GuestCardCheckout bookingId={booking.id} amountLabel={amountLabel} />
        )}
      </div>
    </div>
  );
}