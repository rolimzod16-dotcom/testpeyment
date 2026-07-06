"use client";

import { useTranslations } from "next-intl";

type Props = {
  bookingId: string;
  amountLabel: string;
};

export function PayPalPaymentOptions({ bookingId, amountLabel }: Props) {
  const t = useTranslations("payment");
  const paypalUrl = `/api/payments/paypal/start?bookingId=${bookingId}&type=paypal`;
  const cardUrl = `/api/payments/paypal/start?bookingId=${bookingId}&type=card`;

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        <p className="font-semibold">{t("paypalLive")}</p>
        <p className="mt-1 text-emerald-700">{t("paypalDesc")}</p>
      </div>

      <a
        href={paypalUrl}
        className="flex w-full items-center justify-center rounded-full bg-[#ffc439] py-4 text-lg font-bold text-[#003087] transition hover:bg-[#f5ba2e]"
      >
        {t("payPaypal", { amount: amountLabel })}
      </a>

      <a
        href={cardUrl}
        className="flex w-full items-center justify-center rounded-full bg-foreground py-4 text-lg font-semibold text-white transition hover:bg-foreground/90"
      >
        {t("payCard", { amount: amountLabel })}
      </a>

      <p className="text-center text-xs text-muted">{t("redirectNote")}</p>
    </div>
  );
}