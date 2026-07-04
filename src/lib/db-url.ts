export function getDatabaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }

  try {
    const url = new URL(raw);
    // channel_binding breaks many Node/serverless pg clients on Vercel
    url.searchParams.delete("channel_binding");
    url.searchParams.set("uselibpqcompat", "true");
    url.searchParams.set("sslmode", "require");
    return url.toString();
  } catch {
    return raw;
  }
}