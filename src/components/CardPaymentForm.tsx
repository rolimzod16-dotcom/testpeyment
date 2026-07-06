"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  PayPalScriptProvider,
  PayPalCardFieldsProvider,
  PayPalCardFieldsForm,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import { useRouter } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/utils";

type Props = {
  bookingId: string;
  amount: number;
  currency: string;
};

const fieldStyle = {
  input: {
    "font-size": "16px",
    color: "#1d1d1f",
    padding: "12px 14px",
    background: "#f5f5f7",
    border: "1px solid rgba(0,0,0,0.08)",
    "border-radius": "12px",
  },
  ".invalid": { color: "#dc2626" },
};

function PayButton({ amount, currency }: { amount: number; currency: string }) {
  const t = useTranslations("payment");
  const { cardFieldsForm } = usePayPalCardFields();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    if (!cardFieldsForm) {
      setError(t("cardFormLoading"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const state = await cardFieldsForm.getState();
      if (!state.isFormValid) {
        throw new Error(t("cardFormInvalid"));
      }

      await cardFieldsForm.submit();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("cardSubmitFailed"));
      setLoading(false);
    }
  }

  const ready = Boolean(cardFieldsForm?.isEligible?.() ?? cardFieldsForm);

  return (
    <>
      <PayPalCardFieldsForm className="mt-4 space-y-3" />

      {error && (
        <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={loading || !ready}
        className="mt-6 flex w-full items-center justify-center rounded-full bg-foreground py-4 text-lg font-semibold text-white transition hover:bg-foreground/90 disabled:opacity-60"
      >
        {loading ? t("cardProcessing") : t("cardPay", { amount: formatCurrency(amount, currency) })}
      </button>
    </>
  );
}

export function CardPaymentForm({ bookingId, amount, currency }: Props) {
  const t = useTranslations("payment");
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const isSandbox = process.env.NEXT_PUBLIC_PAYPAL_MODE !== "live";
  const [error, setError] = useState("");

  if (!clientId) {
    return (
      <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200">
        {t("cardNotConfigured")}
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
            throw new Error(data.error || t("cardOrderFailed"));
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
            throw new Error(result.error || t("cardCaptureFailed"));
          }
          router.push(`/confirmation/${bookingId}`);
        }}
        onError={(err) => {
          console.error("PayPal card error:", err);
          setError(t("cardError"));
        }}
      >
        {isSandbox && (
          <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="font-semibold">{t("sandboxCardTitle")}</p>
            <p>
              Visa: <span className="font-mono">4005 5192 0000 0004</span> · Exp: 12/2028 · CVV: 123
            </p>
          </div>
        )}

        {error && (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200">
            {error}
          </p>
        )}

        <PayButton amount={amount} currency={currency} />
      </PayPalCardFieldsProvider>
    </PayPalScriptProvider>
  );
}