import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
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

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const isSandbox = process.env.NEXT_PUBLIC_PAYPAL_MODE !== "live";
  const chargeAmount =
    booking.currency === "USD" && booking.depositAmount < 1 ? 1 : booking.depositAmount;
  const cardPayUrl = `/api/payments/paypal/start?bookingId=${booking.id}&type=card`;
  const paypalPayUrl = `/api/payments/paypal/start?bookingId=${booking.id}&type=paypal`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm uppercase tracking-wider text-amber-500">Шаг 2 из 2</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-100">Оплата бронирования</h1>
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
            Нажмите белую кнопку <strong>«ОПЛАТИТЬ КАРТОЙ»</strong> и введите тестовую карту{" "}
            <span className="font-mono">4032 0320 3446 3523</span>. Не входите в PayPal.
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
            <dt className="text-amber-500">К оплате сейчас</dt>
            <dd className="text-amber-400">{formatCurrency(chargeAmount, booking.currency)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-800 bg-stone-900/70 p-6">
        <h2 className="text-xl font-semibold text-stone-100">Выберите способ оплаты</h2>
        <p className="mt-1 text-sm text-stone-400">
          {booking.package.title} — {formatCurrency(chargeAmount, booking.currency)}
        </p>

        {!clientId ? (
          <p className="mt-4 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">
            PayPal не настроен. Добавьте NEXT_PUBLIC_PAYPAL_CLIENT_ID в Vercel → Redeploy.
          </p>
        ) : (
          <>
            {isSandbox && (
              <div className="mt-4 space-y-2 rounded-lg border border-emerald-800/50 bg-emerald-950/30 p-4 text-sm text-emerald-200">
                <p className="font-semibold">Тест Sandbox — оплата картой</p>
                <p>Нажмите белую кнопку ниже. На странице PayPal введите карту — не логиньтесь.</p>
                <p>
                  Карта: <span className="font-mono">4032 0320 3446 3523</span> · Срок: 12/2028 · CVV:
                  123
                </p>
              </div>
            )}

            <a
              href={cardPayUrl}
              className="mt-6 flex w-full items-center justify-center rounded-full bg-white py-5 text-xl font-extrabold uppercase tracking-wide text-stone-900 transition hover:bg-stone-100"
            >
              Оплатить картой
            </a>

            <a
              href={paypalPayUrl}
              className="mt-3 flex w-full items-center justify-center rounded-full bg-[#ffc439] py-4 text-lg font-bold text-[#003087] transition hover:bg-[#f5ba2e]"
            >
              Оплатить через PayPal
            </a>
          </>
        )}
      </div>
    </div>
  );
}