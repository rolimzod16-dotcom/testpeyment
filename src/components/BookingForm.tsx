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
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-stone-800 bg-stone-900/70 p-6">
      <div>
        <h2 className="text-2xl font-semibold text-stone-100">Book This Expedition</h2>
        <p className="mt-1 text-sm text-stone-400">
          Deposit today: {formatCurrency(deposit)} ({pkg.depositPercent}% of {formatCurrency(total)})
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-stone-300">Full Name *</span>
          <input
            name="customerName"
            required
            className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
            placeholder="John Smith"
          />
        </label>
        <label className="block">
          <span className="text-sm text-stone-300">Email *</span>
          <input
            name="customerEmail"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
            placeholder="john@email.com"
          />
        </label>
        <label className="block">
          <span className="text-sm text-stone-300">Phone</span>
          <input
            name="customerPhone"
            className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
            placeholder="+1 555 000 0000"
          />
        </label>
        <label className="block">
          <span className="text-sm text-stone-300">Country</span>
          <input
            name="country"
            className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
            placeholder="United States"
          />
        </label>
        <label className="block">
          <span className="text-sm text-stone-300">Guests *</span>
          <input
            name="guests"
            type="number"
            min={1}
            max={pkg.maxGuests}
            defaultValue={1}
            required
            className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
          />
        </label>
        <label className="block">
          <span className="text-sm text-stone-300">Preferred Start Date *</span>
          <input
            name="startDate"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-stone-300">Special Requests</span>
        <textarea
          name="specialRequests"
          rows={3}
          className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
          placeholder="Dietary needs, experience level, equipment requests..."
        />
      </label>

      {error && <p className="rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-amber-700 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
      >
        {loading ? "Creating booking..." : `Continue to Payment — ${formatCurrency(deposit)}`}
      </button>
    </form>
  );
}