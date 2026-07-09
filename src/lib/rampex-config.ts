export function getRampexApiKey(): string | undefined {
  return process.env.RAMPEX_API_KEY?.trim() || undefined;
}

export function getRampexWebhookSecret(): string | undefined {
  return process.env.RAMPEX_WEBHOOK_SECRET?.trim() || undefined;
}

export function getRampexProvider(): string {
  return process.env.RAMPEX_PROVIDER?.trim() || "hosted";
}

export function getRampexApiBase(): string {
  return (process.env.RAMPEX_API_BASE?.trim() || "https://api.rampex.io").replace(/\/$/, "");
}

export function validateRampexEnv(): {
  ok: boolean;
  issues: string[];
  hasWebhookSecret: boolean;
} {
  const issues: string[] = [];
  if (!getRampexApiKey()) issues.push("Missing RAMPEX_API_KEY");
  const hasWebhookSecret = Boolean(getRampexWebhookSecret());
  if (!hasWebhookSecret) {
    issues.push("Missing RAMPEX_WEBHOOK_SECRET (webhooks will not verify)");
  }
  return { ok: issues.filter((i) => !i.includes("WEBHOOK")).length === 0, issues, hasWebhookSecret };
}
