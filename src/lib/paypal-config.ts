export type PayPalMode = "live" | "sandbox";

export function getPayPalMode(): PayPalMode {
  const mode = process.env.PAYPAL_MODE?.trim().toLowerCase();
  return mode === "live" ? "live" : "sandbox";
}

export function isPayPalLive(): boolean {
  return getPayPalMode() === "live";
}

export function getPayPalApiUrl(): string {
  return isPayPalLive()
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function getPublicPayPalMode(): PayPalMode {
  const publicMode = process.env.NEXT_PUBLIC_PAYPAL_MODE?.trim().toLowerCase();
  return publicMode === "live" ? "live" : "sandbox";
}

export function validatePayPalEnv(): {
  ok: boolean;
  mode: PayPalMode;
  issues: string[];
} {
  const issues: string[] = [];
  const mode = getPayPalMode();
  const publicMode = getPublicPayPalMode();

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    issues.push("Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID");
  }
  if (!process.env.PAYPAL_CLIENT_SECRET) {
    issues.push("Missing PAYPAL_CLIENT_SECRET");
  }
  if (publicMode !== mode) {
    issues.push(
      `Mode mismatch: PAYPAL_MODE=${mode} but NEXT_PUBLIC_PAYPAL_MODE=${publicMode}`
    );
  }
  if (mode === "live" && !process.env.NEXT_PUBLIC_SITE_URL) {
    issues.push("Live mode: set NEXT_PUBLIC_SITE_URL to your production domain");
  }

  return { ok: issues.length === 0, mode, issues };
}