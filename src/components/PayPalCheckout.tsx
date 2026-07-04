"use client";

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
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6">
      <h2 className="text-xl font-semibold text-stone-100">Pay Deposit</h2>
      <p className="mt-1 text-sm text-stone-400">
        {packageTitle} — {formatCurrency(depositAmount, currency)}
      </p>

      {!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && (
        <p className="mt-4 rounded-lg bg-amber-950/40 px-3 py-2 text-sm text-amber-300">
          Add your PayPal Client ID to .env — using sandbox test mode until configured.
        </p>
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
            style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
            createOrder={async () => {
              const res = await fetch("/api/payments/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Failed to create order");
              return data.orderId;
            }}
            onApprove={async (data) => {
              const res = await fetch("/api/payments/paypal/capture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  bookingId,
                  orderId: data.orderID,
                }),
              });
              const result = await res.json();
              if (!res.ok) throw new Error(result.error || "Payment failed");
              router.push(`/confirmation/${bookingId}`);
            }}
            onError={(err) => {
              console.error("PayPal error:", err);
              alert("Payment error. Please try again or contact support.");
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
}