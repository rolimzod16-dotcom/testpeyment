import { NextResponse } from "next/server";

export async function GET() {
  const hasClientId = Boolean(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
  const hasSecret = Boolean(process.env.PAYPAL_CLIENT_SECRET);
  const mode = process.env.PAYPAL_MODE || "sandbox";

  if (!hasClientId || !hasSecret) {
    return NextResponse.json({
      ok: false,
      error: "Missing PayPal env vars on server",
      hasClientId,
      hasSecret,
      mode,
    });
  }

  const api =
    mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${api}/v1/oauth2/token`, {
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
    mode,
    hasClientId,
    hasSecret,
    paypal: res.ok ? "connected" : text,
  });
}