import { getSiteUrl } from "@/lib/site-url";

const PAYPAL_API =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const MIN_PAYPAL_USD = 1;

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`PayPal auth failed: ${detail}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

function normalizeAmount(amount: number, currency: string) {
  let value = amount;
  if (currency === "USD" && value < MIN_PAYPAL_USD) {
    value = MIN_PAYPAL_USD;
  }
  return value.toFixed(2);
}

type PayPalOrderResponse = {
  id: string;
  links?: Array<{ href: string; rel: string; method: string }>;
};

export type PayPalPaymentType = "card" | "paypal" | "inline-card";

export async function createPayPalOrder(params: {
  depositAmount: number;
  currency: string;
  bookingRef: string;
  bookingId: string;
  description: string;
  paymentType?: PayPalPaymentType;
}) {
  const token = await getAccessToken();
  const siteUrl = getSiteUrl();
  const value = normalizeAmount(params.depositAmount, params.currency);
  const paymentType = params.paymentType ?? "inline-card";

  const orderBody: Record<string, unknown> = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: params.bookingRef,
        description: params.description,
        custom_id: params.bookingRef,
        amount: {
          currency_code: params.currency,
          value,
        },
      },
    ],
  };

  if (paymentType !== "inline-card") {
    const landingPage = paymentType === "card" ? "BILLING" : "NO_PREFERENCE";
    orderBody.application_context = {
      brand_name: process.env.NEXT_PUBLIC_SITE_NAME || "WildFrontier Expeditions",
      landing_page: landingPage,
      locale: "en-US",
      user_action: paymentType === "card" ? "CONTINUE" : "PAY_NOW",
      shipping_preference: "NO_SHIPPING",
      payment_method: {
        payee_preferred: "UNRESTRICTED",
      },
      return_url: `${siteUrl}/api/payments/paypal/return?bookingId=${params.bookingId}`,
      cancel_url: `${siteUrl}/payment/${params.bookingId}?cancelled=1`,
    };
  }

  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderBody),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PayPal order creation failed: ${error}`);
  }

  const order = (await response.json()) as PayPalOrderResponse;
  const approveLink = order.links?.find((l) => l.rel === "approve")?.href;

  if (!approveLink) {
    throw new Error("PayPal approve link not found");
  }

  return { orderId: order.id, approveUrl: approveLink };
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getAccessToken();

  const response = await fetch(
    `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PayPal capture failed: ${error}`);
  }

  return response.json() as Promise<{
    id: string;
    status: string;
    purchase_units: Array<{
      payments: {
        captures: Array<{
          id: string;
          status: string;
          amount: { value: string; currency_code: string };
        }>;
      };
    }>;
  }>;
}