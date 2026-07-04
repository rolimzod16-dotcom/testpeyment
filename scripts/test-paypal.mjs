import "dotenv/config";

const id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const secret = process.env.PAYPAL_CLIENT_SECRET;
const mode = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";
const api =
  mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

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
  console.log("PayPal OK (" + mode + ")");
  console.log(text);
} else {
  console.error("PayPal FAILED (" + mode + ")");
  console.error(text);
  console.error("\nFix: open PayPal Developer -> Default Application -> click COPY icons for Client ID and Secret.");
  console.error("If secret is old (2022), click three dots -> Generate new secret.");
  process.exit(1);
}