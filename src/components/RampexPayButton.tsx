"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Props = {
  bookingId: string;
  amountLabel: string;
};

export function RampexPayButton({ bookingId, amountLabel }: Props) {
  const t = useTranslations("payment");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startRampex() {
    setLoading(true);
    setError("");
    try {
      // Prefer redirect via start endpoint (handles create + redirect server-side)
      window.location.href = `/api/payments/rampex/start?bookingId=${encodeURIComponent(bookingId)}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : t("cardError"));
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">{t("rampexSectionTitle")}</p>
      <p className="text-sm text-muted">{t("rampexDesc")}</p>
      <button
        type="button"
        onClick={startRampex}
        disabled={loading}
        className="flex w-full items-center justify-center rounded-full bg-foreground py-4 text-lg font-semibold text-white transition hover:bg-foreground/90 disabled:opacity-60"
      >
        {loading ? t("rampexRedirecting") : t("payRampex", { amount: amountLabel })}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-center text-xs text-muted">{t("rampexNote")}</p>
    </div>
  );
}
