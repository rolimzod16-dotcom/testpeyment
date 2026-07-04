import "dotenv/config";
import { execSync } from "node:child_process";

function normalizeDatabaseUrl(raw) {
  if (!raw) throw new Error("DATABASE_URL is missing");
  const url = new URL(raw);
  url.searchParams.delete("channel_binding");
  if (!url.searchParams.has("sslmode")) {
    url.searchParams.set("sslmode", "require");
  }
  return url.toString();
}

const env = {
  ...process.env,
  DATABASE_URL: normalizeDatabaseUrl(process.env.DATABASE_URL),
  NODE_NO_WARNINGS: "1",
};

console.log("Setting up database...");
execSync("npx prisma db push --skip-generate", { stdio: "inherit", env });
execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env });
console.log("Database ready.");