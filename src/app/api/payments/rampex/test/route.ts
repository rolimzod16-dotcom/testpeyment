import { NextResponse } from "next/server";
import { validateRampexEnv } from "@/lib/rampex-config";
import { validateRampexApiKey } from "@/lib/rampex";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const env = validateRampexEnv();
  const siteUrl = getSiteUrl();

  if (!env.ok) {
    return NextResponse.json({
      ok: false,
      provider: "rampex",
      issues: env.issues,
      siteUrl,
      webhookUrl: `${siteUrl}/api/payments/rampex/webhook`,
    });
  }

  try {
    const merchant = await validateRampexApiKey();
    return NextResponse.json({
      ok: true,
      provider: "rampex",
      apiConnected: true,
      merchant,
      hasWebhookSecret: env.hasWebhookSecret,
      siteUrl,
      webhookUrl: `${siteUrl}/api/payments/rampex/webhook`,
      checklist: {
        envVarsSet: true,
        apiConnected: true,
        webhookConfigured: env.hasWebhookSecret,
        readyForPayments: true,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        provider: "rampex",
        apiConnected: false,
        error: error instanceof Error ? error.message : "Validate failed",
        siteUrl,
        webhookUrl: `${siteUrl}/api/payments/rampex/webhook`,
      },
      { status: 500 }
    );
  }
}
