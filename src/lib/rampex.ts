import { createHmac, timingSafeEqual } from "crypto";
import {
  getRampexApiBase,
  getRampexApiKey,
  getRampexProvider,
  getRampexWebhookSecret,
} from "@/lib/rampex-config";
import { getSiteUrl } from "@/lib/site-url";

export type RampexCreateLinkResult = {
  linkId: string;
  paymentUrl: string;
  shortUrl?: string;
  raw: Record<string, unknown>;
};

function requireApiKey() {
  const key = getRampexApiKey();
  if (!key) throw new Error("RAMPEX_API_KEY is not configured");
  return key;
}

function pickString(...values: unknown[]): string | undefined {
  for (const v of values) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

export async function validateRampexApiKey() {
  const key = requireApiKey();
  const res = await fetch(`${getRampexApiBase()}/api-validate-key`, {
    method: "POST",
    headers: { "X-API-Key": key },
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : `Rampex validate failed (${res.status})`
    );
  }
  return data;
}

export async function createRampexPaymentLink(params: {
  amount: number;
  currency: string;
  customerEmail: string;
  description: string;
  bookingId: string;
  bookingRef: string;
}) {
  const key = requireApiKey();
  const siteUrl = getSiteUrl();
  const amount = Math.max(Number(params.amount.toFixed(2)), 1);
  const currency = (params.currency || "USD").toUpperCase();

  const body = {
    amount,
    currency,
    customer_email: params.customerEmail,
    description: params.description.slice(0, 200),
    provider: getRampexProvider(),
    // Return customer to our confirmation/payment page after checkout
    payment_url: `${siteUrl}/payment/${params.bookingId}?rampex=return`,
    ipn_token: params.bookingId,
    woo_order_id: params.bookingRef,
    woo_store_url: siteUrl,
  };

  const res = await fetch(`${getRampexApiBase()}/api-create-payment-link`, {
    method: "POST",
    headers: {
      "X-API-Key": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const errObj = data.error as { message?: string; code?: string } | undefined;
    const code = errObj?.code || (typeof data.code === "string" ? data.code : "");
    const msg =
      errObj?.message ||
      (typeof data.error === "string" ? data.error : null) ||
      (typeof data.message === "string" ? data.message : null) ||
      `Rampex create link failed (${res.status})`;
    throw new Error(code ? `${code}: ${msg}` : msg);
  }

  const nested = (data.data as Record<string, unknown> | undefined) || data;
  const linkId = pickString(
    nested.link_id,
    nested.payment_link_id,
    data.link_id,
    data.payment_link_id
  );
  const paymentUrl = pickString(
    nested.redirect_url,
    nested.payment_url,
    nested.checkout_url,
    nested.short_url,
    data.redirect_url,
    data.payment_url,
    data.checkout_url,
    data.short_url
  );
  const shortUrl = pickString(nested.short_url, data.short_url);

  if (!paymentUrl) {
    throw new Error("Rampex response missing payment URL");
  }

  return {
    linkId: linkId || params.bookingId,
    paymentUrl,
    shortUrl,
    raw: data,
  } satisfies RampexCreateLinkResult;
}

export async function getRampexPaymentStatus(linkId: string) {
  const key = requireApiKey();
  const url = new URL(`${getRampexApiBase()}/api-get-payment-status`);
  url.searchParams.set("link_id", linkId);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "X-API-Key": key },
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : `Rampex status failed (${res.status})`
    );
  }
  return data;
}

export function verifyRampexWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = getRampexWebhookSecret();
  if (!secret) return false;
  if (!signatureHeader) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = signatureHeader.trim().replace(/^sha256=/i, "");

  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(provided, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function isRampexPaidStatus(status: unknown): boolean {
  const s = String(status || "").toLowerCase();
  return s === "completed" || s === "paid" || s === "success" || s === "successful";
}
