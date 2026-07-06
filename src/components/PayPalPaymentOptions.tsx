type Props = {
  bookingId: string;
  amountLabel: string;
};

export function PayPalPaymentOptions({ bookingId, amountLabel }: Props) {
  const paypalUrl = `/api/payments/paypal/start?bookingId=${bookingId}&type=paypal`;
  const cardUrl = `/api/payments/paypal/start?bookingId=${bookingId}&type=card`;

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-lg border border-emerald-800/40 bg-emerald-950/20 p-4 text-sm text-emerald-200">
        <p className="font-semibold">✓ Live PayPal — реальные платежи</p>
        <p className="mt-1 text-emerald-200/90">
          Оплата через PayPal или банковскую карту. Средства поступают на бизнес-аккаунт.
        </p>
      </div>

      <a
        href={paypalUrl}
        className="flex w-full items-center justify-center rounded-full bg-[#ffc439] py-4 text-lg font-bold text-[#003087] transition hover:bg-[#f5ba2e]"
      >
        Pay with PayPal — {amountLabel}
      </a>

      <a
        href={cardUrl}
        className="flex w-full items-center justify-center rounded-full border border-stone-600 bg-stone-800 py-4 text-lg font-semibold text-stone-100 transition hover:bg-stone-700"
      >
        Pay with Debit or Credit Card — {amountLabel}
      </a>

      <p className="text-center text-xs text-stone-500">
        Вы будете перенаправлены на paypal.com для безопасной оплаты.
      </p>
    </div>
  );
}