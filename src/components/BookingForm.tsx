"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Package } from "@/generated/prisma/client";
import { calculateDeposit, formatCurrency } from "@/lib/utils";

export function BookingForm({ pkg }: { pkg: Package }) {
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
      if (!res.ok) throw new Error(data.error || "Booking failed");
      router.push(`/payment/${data.bookingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 border border-[hsl(218,55%,12%)]/10 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="font-serif text-2xl font-medium text-[hsl(218,55%,12%)]">
          Book This Expedition
        </h2>
        <p className="mt-1 text-sm text-[hsl(218,55%,12%)]/65">
          Deposit today: {formatCurrency(deposit)} ({pkg.depositPercent}% of {formatCurrency(total)})
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-[hsl(218,55%,12%)]/75">Full Name *</span>
          <input
            name="customerName"
            required
            className="mt-1 w-full border border-[hsl(218,55%,12%)]/15 bg-cream px-3 py-2 text-[hsl(218,55%,12%)]"
            placeholder="John Smith"
          />
        </label>
        <label className="block">
          <span className="text-sm text-[hsl(218,55%,12%)]/75">Email *</span>
          <input
            name="customerEmail"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-[hsl(218,55%,12%)]/15 bg-cream px-3 py-2 text-[hsl(218,55%,12%)]"
            placeholder="john@email.com"
          />
        </label>
        <label className="block">
          <span className="text-sm text-[hsl(218,55%,12%)]/75">Phone</span>
          <input
            name="customerPhone"
            className="mt-1 w-full rounded-lg border border-[hsl(218,55%,12%)]/15 bg-cream px-3 py-2 text-[hsl(218,55%,12%)]"
            placeholder="+1 555 000 0000"
          />
        </label>
        <label className="block">
          <span className="text-sm text-[hsl(218,55%,12%)]/75">Country</span>
          <input
            name="country"
            className="mt-1 w-full rounded-lg border border-[hsl(218,55%,12%)]/15 bg-cream px-3 py-2 text-[hsl(218,55%,12%)]"
            placeholder="United States"
          />
        </label>
        <label className="block">
          <span className="text-sm text-[hsl(218,55%,12%)]/75">Guests *</span>
          <input
            name="guests"
            type="number"
            min={1}
            max={pkg.maxGuests}
            defaultValue={1}
            required
            className="mt-1 w-full rounded-lg border border-[hsl(218,55%,12%)]/15 bg-cream px-3 py-2 text-[hsl(218,55%,12%)]"
          />
        </label>
        <label className="block">
          <span className="text-sm text-[hsl(218,55%,12%)]/75">Preferred Start Date *</span>
          <input
            name="startDate"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className="mt-1 w-full rounded-lg border border-[hsl(218,55%,12%)]/15 bg-cream px-3 py-2 text-[hsl(218,55%,12%)]"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-[hsl(218,55%,12%)]/75">Special Requests</span>
        <textarea
          name="specialRequests"
          rows={3}
          className="mt-1 w-full rounded-lg border border-[hsl(218,55%,12%)]/15 bg-cream px-3 py-2 text-[hsl(218,55%,12%)]"
          placeholder="Dietary needs, experience level, equipment requests..."
        />
      </label>

      {error && <p className="rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[hsl(35,65%,45%)] py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[hsl(35,65%,38%)] disabled:opacity-60"
      >
        {loading ? "Creating booking..." : `Continue to Payment — ${formatCurrency(deposit)}`}
      </button>
    </form>
  );
}