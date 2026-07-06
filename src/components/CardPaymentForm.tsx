"use client";

import { useState } from "react";
import {
  PayPalScriptProvider,
  PayPalCardFieldsProvider,
  PayPalCardFieldsForm,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import { formatCurrency } from "@/lib/utils";

type Props = {
  bookingId: string;
  amount: number;
  currency: string;
};

const fieldStyle = {
  input: {
    "font-size": "16px",
    color: "#f5f5f4",
    padding: "12px 14px",
  },
  ".invalid": { color: "#fca5a5" },
};

function PayButton({ amount, currency }: { amount: number; currency: string }) {
  const { cardFieldsForm } = usePayPalCardFields();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    if (!cardFieldsForm) {
      setError("Форма карты ещё загружается. Подождите 5 секунд.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const state = await cardFieldsForm.getState();
      if (!state.isFormValid) {
        throw new Error("Заполните все поля карты правильно.");
      }

      await cardFieldsForm.submit({
        billingAddress: {
          addressLine1: "123 Main Street",
          adminArea2: "New York",
          adminArea1: "NY",
          postalCode: "10001",
          countryCode: "US",
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось отправить карту");
      setLoading(false);
    }
  }

  const ready = Boolean(cardFieldsForm?.isEligible?.() ?? cardFieldsForm);

  return (
    <>
      <PayPalCardFieldsForm className="mt-4 space-y-3" />

      {error && (
        <p className="mt-3 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={loading || !ready}
        className="mt-6 flex w-full items-center justify-center rounded-full bg-white py-5 text-xl font-extrabold uppercase tracking-wide text-stone-900 transition hover:bg-stone-100 disabled:opacity-60"
      >
        {loading ? "Обработка..." : `Оплатить ${formatCurrency(amount, currency)}`}
      </button>
    </>
  );
}

export function CardPaymentForm({ bookingId, amount, currency }: Props) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const isSandbox = process.env.NEXT_PUBLIC_PAYPAL_MODE !== "live";
  const [error, setError] = useState("");

  if (!clientId) {
    return (
      <p className="mt-4 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">
        PayPal не настроен в Vercel.
      </p>
    );
  }

  const scriptOptions = {
    clientId,
    currency,
    intent: "capture" as const,
    components: "card-fields",
    ...(isSandbox ? { "buyer-country": "US" } : {}),
  };

  return (
    <PayPalScriptProvider options={scriptOptions}>
      <PayPalCardFieldsProvider
        style={fieldStyle}
        createOrder={async () => {
          const res = await fetch("/api/payments/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId }),
          });
          const data = await res.json();
          if (!res.ok || !data.orderId) {
            throw new Error(data.error || "Не удалось создать заказ");
          }
          return data.orderId;
        }}
        onApprove={async (data) => {
          const res = await fetch("/api/payments/paypal/capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId, orderId: data.orderID }),
          });
          const result = await res.json();
          if (!res.ok || !result.success) {
            throw new Error(result.error || "Оплата не прошла");
          }
          window.location.href = `/confirmation/${bookingId}`;
        }}
        onError={(err) => {
          console.error("PayPal card error:", err);
          setError("Ошибка PayPal. Проверьте карту и попробуйте снова.");
        }}
      >
        {isSandbox && (
          <div className="space-y-2 rounded-lg border border-emerald-800/50 bg-emerald-950/30 p-4 text-sm text-emerald-200">
            <p className="font-semibold">Тест Sandbox — карта прямо здесь, без входа в PayPal</p>
            <p>
              Visa: <span className="font-mono">4005 5192 0000 0004</span> · Срок: 12/2028 · CVV: 123
            </p>
          </div>
        )}

        {error && (
          <p className="mt-3 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">{error}</p>
        )}

        <PayButton amount={amount} currency={currency} />
      </PayPalCardFieldsProvider>
    </PayPalScriptProvider>
  );
}