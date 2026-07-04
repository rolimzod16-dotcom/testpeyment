import { format } from "date-fns";

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "MMMM d, yyyy");
}

export function generateBookingRef() {
  const part = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `WF-${Date.now().toString(36).toUpperCase().slice(-4)}${part}`;
}

export function generateReceiptNumber() {
  const year = new Date().getFullYear();
  const serial = Math.floor(Math.random() * 900000 + 100000);
  return `RCP-${year}-${serial}`;
}

export function calculateDeposit(total: number, percent: number) {
  return Math.round(total * (percent / 100) * 100) / 100;
}

export type PackageCategory = "tours" | "hunting" | "survival";

export const categoryLabels: Record<PackageCategory, string> = {
  tours: "Tours",
  hunting: "Hunting",
  survival: "Survival",
};

export function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}