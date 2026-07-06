"use client";

import { useTranslations } from "next-intl";
import { CardPaymentForm } from "@/components/CardPaymentForm";

type Props = {
  bookingId: string;
  amount: number;
  currency: string;
  amountLabel: string;
};

export function PayPalPaymentOptions({ bookingId, amount, currency, amountLabel }: Props) {
  const t = useTranslations("payment");
  const paypalUrl = `/api/payments/paypal/start?bookingId=${bookingId}&type=paypal`;

  return (
    <div className="mt-4 space-y-6">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        <p className="font-semibold">{t("paypalLive")}</p>
        <p className="mt-1 text-emerald-700">{t("paypalDesc")}</p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">{t("cardSectionTitle")}</p>
        <p className="text-sm text-muted">{t("cardSectionDesc")}</p>
        <CardPaymentForm bookingId={bookingId} amount={amount} currency={currency} />
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-black/[0.06]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-white px-3 text-muted">{t("orDivider")}</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">{t("paypalSectionTitle")}</p>
        <a
          href={paypalUrl}
          className="flex w-full items-center justify-center rounded-full bg-[#ffc439] py-4 text-lg font-bold text-[#003087] transition hover:bg-[#f5ba2e]"
        >
          {t("payPaypal", { amount: amountLabel })}
        </a>
        <p className="text-center text-xs text-muted">{t("redirectNote")}</p>
      </div>
    </div>
  );
}