"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

type Props = {
  bookingId: string;
  depositAmount: number;
  currency: string;
  packageTitle: string;
};

type PaymentType = "card" | "paypal";

export function PayPalCheckout({ bookingId, depositAmount, currency, packageTitle }: Props) {
  const [loading, setLoading] = useState<PaymentType | null>(null);
  const [error, setError] = useState("");

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const chargeAmount = currency === "USD" && depositAmount < 1 ? 1 : depositAmount;
  const isSandbox = process.env.NEXT_PUBLIC_PAYPAL_MODE !== "live";

  async function handlePay(paymentType: PaymentType) {
    setLoading(paymentType);
    setError("");

    try {
      const res = await fetch("/api/payments/paypal/redirect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, paymentType }),
      });
      const data = await res.json();

      if (!res.ok || !data.approveUrl) {
        throw new Error(data.error || "Could not start PayPal payment");
      }

      window.location.href = data.approveUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed");
      setLoading(null);
    }
  }

  if (!clientId) {
    return (
      <div className="rounded-2xl border border-red-800 bg-red-950/30 p-6">
        <p className="font-semibold text-red-300">PayPal not configured</p>
        <p className="mt-2 text-sm text-red-200/80">
          Add NEXT_PUBLIC_PAYPAL_CLIENT_ID in Vercel, then Redeploy.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6">
      <h2 className="text-xl font-semibold text-stone-100">Оплата</h2>
      <p className="mt-1 text-sm text-stone-400">
        {packageTitle} — {formatCurrency(chargeAmount, currency)}
      </p>
      <p className="mt-2 text-sm text-stone-500">
        Деньги поступают на ваш PayPal бизнес-аккаунт (через PayPal).
      </p>

      {isSandbox && (
        <div className="mt-4 space-y-2 rounded-lg border border-emerald-800/50 bg-emerald-950/30 p-4 text-sm text-emerald-200">
          <p className="font-semibold">Тест (Sandbox) — оплата картой</p>
          <p>
            Нажмите <strong>«Оплатить картой»</strong> → откроется форма карты PayPal.
            <strong> Не входите</strong> в PayPal аккаунт.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-emerald-200/90">
            <li>
              Карта: <span className="font-mono">4032 0320 3446 3523</span>
            </li>
            <li>Срок: любая будущая дата (например 12/2028)</li>
            <li>CVV: любые 3 цифры (например 123)</li>
            <li>Имя и адрес: любые (например John Doe, New York)</li>
          </ul>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      <button
        type="button"
        onClick={() => handlePay("card")}
        disabled={loading !== null}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-stone-100 py-4 text-lg font-bold text-stone-900 transition hover:bg-white disabled:opacity-60"
      >
        {loading === "card" ? "Открываем форму карты..." : "Оплатить картой"}
      </button>

      <button
        type="button"
        onClick={() => handlePay("paypal")}
        disabled={loading !== null}
        className="mt-3 flex w-full items-center justify-center gap-3 rounded-full bg-[#ffc439] py-4 text-lg font-bold text-[#003087] transition hover:bg-[#f5ba2e] disabled:opacity-60"
      >
        {loading === "paypal" ? "Переход на PayPal..." : "Оплатить через PayPal"}
      </button>
    </div>
  );
}