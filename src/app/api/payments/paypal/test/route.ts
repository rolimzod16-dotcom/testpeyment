import { NextResponse } from "next/server";
import { getPayPalApiUrl, validatePayPalEnv } from "@/lib/paypal-config";
import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const config = validatePayPalEnv();
  const siteUrl = getSiteUrl();

  if (!config.ok) {
    return NextResponse.json({
      ok: false,
      mode: config.mode,
      siteUrl,
      issues: config.issues,
    });
  }

  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${getPayPalApiUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const text = await res.text();

  return NextResponse.json({
    ok: res.ok,
    mode: config.mode,
    live: config.mode === "live",
    siteUrl,
    returnUrlExample: `${siteUrl}/api/payments/paypal/return?bookingId=EXAMPLE`,
    paypal: res.ok ? "connected" : text,
    checklist: {
      envVarsSet: true,
      apiConnected: res.ok,
      siteUrlSet: Boolean(process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL),
      readyForPayments: res.ok && Boolean(process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL),
    },
  });
}