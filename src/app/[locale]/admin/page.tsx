"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

type Booking = {
  id: string;
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  guests: number;
  startDate: string;
  totalAmount: number;
  depositAmount: number;
  status: string;
  receiptNumber: string | null;
  paidAt: string | null;
  package: { title: string; category: string };
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  async function loadBookings() {
    setError("");
    const res = await fetch("/api/admin/bookings", {
      headers: { "x-admin-password": password },
    });
    if (!res.ok) {
      setError("Invalid password");
      return;
    }
    const data = await res.json();
    setBookings(data);
    setLoaded(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-stone-100">Admin — Bookings</h1>

      {!loaded && (
        <div className="mt-8 flex max-w-md gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="flex-1 rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100"
          />
          <button
            onClick={loadBookings}
            className="rounded-lg bg-amber-700 px-4 py-2 font-semibold text-white"
          >
            Login
          </button>
        </div>
      )}

      {error && <p className="mt-4 text-red-400">{error}</p>}

      {loaded && (
        <div className="mt-8 overflow-x-auto rounded-xl border border-stone-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-900 text-stone-400">
              <tr>
                <th className="p-3">Ref</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Package</th>
                <th className="p-3">Date</th>
                <th className="p-3">Deposit</th>
                <th className="p-3">Status</th>
                <th className="p-3">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-stone-800 text-stone-300">
                  <td className="p-3 font-mono text-xs">{b.bookingRef}</td>
                  <td className="p-3">
                    <p>{b.customerName}</p>
                    <p className="text-xs text-stone-500">{b.customerEmail}</p>
                  </td>
                  <td className="p-3">
                    <p>{b.package.title}</p>
                    <p className="text-xs uppercase text-stone-500">{b.package.category}</p>
                  </td>
                  <td className="p-3">{formatDate(b.startDate)}</td>
                  <td className="p-3">{formatCurrency(b.depositAmount)}</td>
                  <td className="p-3">
                    <span
                      className={
                        b.status === "paid"
                          ? "text-emerald-400"
                          : b.status === "awaiting_payment"
                            ? "text-amber-400"
                            : "text-stone-500"
                      }
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {b.status === "paid" ? (
                      <a
                        href={`/api/receipts/${b.id}`}
                        className="text-amber-400 hover:underline"
                      >
                        PDF
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <p className="p-6 text-center text-stone-500">No bookings yet.</p>
          )}
        </div>
      )}
    </div>
  );
}