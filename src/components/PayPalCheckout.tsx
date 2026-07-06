"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

type Props = {
  bookingId: string;
  depositAmount: number;
  currency: string;
  packageTitle: string;
};

export function PayPalCheckout({ bookingId, depositAmount, currency, packageTitle }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const chargeAmount = currency === "USD" && depositAmount < 1 ? 1 : depositAmount;
  const isSandbox = process.env.NEXT_PUBLIC_PAYPAL_MODE !== "live";

  async function handlePay() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments/paypal/redirect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();

      if (!res.ok || !data.approveUrl) {
        throw new Error(data.error || "Could not start PayPal payment");
      }

      window.location.href = data.approveUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed");
      setLoading(false);
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
      <h2 className="text-xl font-semibold text-stone-100">Pay with PayPal</h2>
      <p className="mt-1 text-sm text-stone-400">
        {packageTitle} — {formatCurrency(chargeAmount, currency)}
      </p>

      {isSandbox && (
        <div className="mt-4 space-y-3 rounded-lg border border-amber-800/50 bg-amber-950/30 p-4 text-sm text-amber-200">
          <p className="font-semibold">Sandbox test mode</p>
          <p className="text-amber-200/80">
            Do <strong>not</strong> use your real PayPal account. Pick one option:
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-amber-200/80">
            <li>
              <strong>Guest card (easiest):</strong> on the PayPal page click{" "}
              <em>Pay with Debit or Credit Card</em>. Use test Visa{" "}
              <span className="font-mono">4032 0320 3446 3523</span>, any future expiry, any CVV.
            </li>
            <li>
              <strong>Sandbox buyer:</strong>{" "}
              <a
                href="https://developer.paypal.com/dashboard/accounts"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-100"
              >
                developer.paypal.com → Sandbox Accounts
              </a>
              . Open a <em>Personal</em> account → edit → set balance to <strong>$5000 USD</strong>.
              Then log in with that sandbox email/password on the PayPal page.
            </li>
          </ol>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#ffc439] py-4 text-lg font-bold text-[#003087] transition hover:bg-[#f5ba2e] disabled:opacity-60"
      >
        {loading ? "Redirecting to PayPal..." : "Pay with PayPal"}
      </button>
    </div>
  );
}