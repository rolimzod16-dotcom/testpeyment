"use client";

import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

type Props = {
  bookingId: string;
  depositAmount: number;
  currency: string;
  packageTitle: string;
};

export function PayPalCheckout({ bookingId, depositAmount, currency, packageTitle }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="rounded-2xl border border-red-800 bg-red-950/30 p-6">
        <p className="font-semibold text-red-300">PayPal not configured</p>
        <p className="mt-2 text-sm text-red-200/80">
          Add NEXT_PUBLIC_PAYPAL_CLIENT_ID in Vercel → Settings → Environment Variables, then
          Redeploy.
        </p>
      </div>
    );
  }

  const chargeAmount = currency === "USD" && depositAmount < 1 ? 1 : depositAmount;

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6">
      <h2 className="text-xl font-semibold text-stone-100">Pay Deposit</h2>
      <p className="mt-1 text-sm text-stone-400">
        {packageTitle} — {formatCurrency(chargeAmount, currency)}
      </p>
      <p className="mt-2 text-xs text-stone-500">
        Sandbox mode: log in with a{" "}
        <strong className="text-stone-400">PayPal Sandbox test buyer</strong> account (not your real
        PayPal).
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      <div className="mt-6">
        <PayPalScriptProvider
          options={{
            clientId,
            currency,
            intent: "capture",
          }}
        >
          <PayPalButtons
            disabled={paying}
            style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
            createOrder={async () => {
              setError("");
              const res = await fetch("/api/payments/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
              });
              const data = await res.json();
              if (!res.ok) {
                const msg = data.error || "Failed to create order";
                setError(msg);
                throw new Error(msg);
              }
              return data.orderId;
            }}
            onApprove={async (data) => {
              setPaying(true);
              setError("");
              try {
                const res = await fetch("/api/payments/paypal/capture", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    bookingId,
                    orderId: data.orderID,
                  }),
                });
                const result = await res.json();
                if (!res.ok) {
                  const msg = result.error || "Payment failed";
                  setError(msg);
                  setPaying(false);
                  return;
                }
                router.push(`/confirmation/${bookingId}`);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Payment failed");
                setPaying(false);
              }
            }}
            onCancel={() => setError("Payment cancelled.")}
            onError={(err) => {
              console.error("PayPal error:", err);
              setError(
                "PayPal error. Use Sandbox test buyer account from developer.paypal.com → Testing Tools → Sandbox Accounts."
              );
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
}