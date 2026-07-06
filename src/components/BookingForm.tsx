"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Package } from "@/generated/prisma/client";
import { useRouter } from "@/i18n/navigation";
import { calculateDeposit, formatCurrency } from "@/lib/utils";

export function BookingForm({ pkg }: { pkg: Package }) {
  const t = useTranslations("booking");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = pkg.priceUsd;
  const deposit = calculateDeposit(total, pkg.depositPercent);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      packageSlug: pkg.slug,
      customerName: form.get("customerName"),
      customerEmail: form.get("customerEmail"),
      customerPhone: form.get("customerPhone"),
      country: form.get("country"),
      guests: Number(form.get("guests")),
      startDate: form.get("startDate"),
      specialRequests: form.get("specialRequests"),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("failed"));
      router.push(`/payment/${data.bookingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted">
          {t("depositToday", {
            deposit: formatCurrency(deposit),
            percent: pkg.depositPercent,
            total: formatCurrency(total),
          })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-foreground/75">{t("fullName")}</span>
          <input
            name="customerName"
            required
            className="mt-1 w-full rounded-lg border border-black/[0.1] bg-surface px-3 py-2 text-foreground"
            placeholder={t("namePlaceholder")}
          />
        </label>
        <label className="block">
          <span className="text-sm text-foreground/75">{t("email")}</span>
          <input
            name="customerEmail"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-black/[0.1] bg-surface px-3 py-2 text-foreground"
            placeholder={t("emailPlaceholder")}
          />
        </label>
        <label className="block">
          <span className="text-sm text-foreground/75">{t("phone")}</span>
          <input
            name="customerPhone"
            className="mt-1 w-full rounded-lg border border-black/[0.1] bg-surface px-3 py-2 text-foreground"
            placeholder={t("phonePlaceholder")}
          />
        </label>
        <label className="block">
          <span className="text-sm text-foreground/75">{t("country")}</span>
          <input
            name="country"
            className="mt-1 w-full rounded-lg border border-black/[0.1] bg-surface px-3 py-2 text-foreground"
            placeholder={t("countryPlaceholder")}
          />
        </label>
        <label className="block">
          <span className="text-sm text-foreground/75">{t("guests")}</span>
          <input
            name="guests"
            type="number"
            min={1}
            max={pkg.maxGuests}
            defaultValue={1}
            required
            className="mt-1 w-full rounded-lg border border-black/[0.1] bg-surface px-3 py-2 text-foreground"
          />
        </label>
        <label className="block">
          <span className="text-sm text-foreground/75">{t("startDate")}</span>
          <input
            name="startDate"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className="mt-1 w-full rounded-lg border border-black/[0.1] bg-surface px-3 py-2 text-foreground"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-foreground/75">{t("specialRequests")}</span>
        <textarea
          name="specialRequests"
          rows={3}
          className="mt-1 w-full rounded-lg border border-black/[0.1] bg-surface px-3 py-2 text-foreground"
          placeholder={t("requestsPlaceholder")}
        />
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-foreground py-3 text-sm font-medium text-white transition hover:bg-foreground/90 disabled:opacity-60"
      >
        {loading ? t("creating") : t("continue", { amount: formatCurrency(deposit) })}
      </button>
    </form>
  );
}