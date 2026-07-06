type Props = {
  bookingId: string;
  amountLabel: string;
};

export function GuestCardCheckout({ bookingId, amountLabel }: Props) {
  const cardUrl = `/api/payments/paypal/start?bookingId=${bookingId}&type=card`;

  return (
    <div className="mt-4">
      <div className="rounded-lg border border-amber-700/40 bg-amber-950/20 p-4 text-sm text-amber-100">
        <p className="font-semibold text-amber-300">Важно — без регистрации PayPal</p>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-amber-100/90">
          <li>Нажмите кнопку ниже — откроется страница PayPal.</li>
          <li>
            <strong>Не вводите</strong> email и пароль. <strong>Не создавайте</strong> аккаунт.
          </li>
          <li>
            Найдите ссылку <strong>«Pay with Debit or Credit Card»</strong> (Оплатить картой) — обычно
            под формой входа.
          </li>
          <li>
            Введите карту: <span className="font-mono">4005 5192 0000 0004</span>, срок{" "}
            <span className="font-mono">12/2028</span>, CVV <span className="font-mono">123</span>.
          </li>
        </ol>
      </div>

      <a
        href={cardUrl}
        className="mt-6 flex w-full items-center justify-center rounded-full bg-white py-5 text-xl font-extrabold uppercase tracking-wide text-stone-900 transition hover:bg-stone-100"
      >
        Оплатить картой {amountLabel}
      </a>

      <p className="mt-4 text-center text-xs text-stone-500">
        Аккаунт PayPal клиенту не нужен. Деньги приходят на ваш бизнес-аккаунт.
      </p>
    </div>
  );
}