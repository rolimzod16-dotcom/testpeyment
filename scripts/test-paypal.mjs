import "dotenv/config";

const mode = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";
const publicMode = process.env.NEXT_PUBLIC_PAYPAL_MODE === "live" ? "live" : "sandbox";
const api =
  mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const secret = process.env.PAYPAL_CLIENT_SECRET;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "(not set)";

console.log("PayPal mode (server):", mode);
console.log("PayPal mode (public):", publicMode);
console.log("Site URL:", siteUrl);

if (mode !== publicMode) {
  console.error("ERROR: PAYPAL_MODE and NEXT_PUBLIC_PAYPAL_MODE must match!");
  process.exit(1);
}

if (mode === "live" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn("WARN: Live mode without NEXT_PUBLIC_SITE_URL — return URLs may fail");
}

if (!id || !secret) {
  console.error("Missing PayPal credentials in .env");
  process.exit(1);
}

const auth = Buffer.from(`${id}:${secret}`).toString("base64");
const res = await fetch(`${api}/v1/oauth2/token`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
});

const text = await res.text();
if (res.ok) {
  console.log(`PayPal OK (${mode})`);
  if (mode === "live") console.log("Ready for LIVE payments");
} else {
  console.error(`PayPal FAILED (${mode})`);
  console.error(text);
  process.exit(1);
}