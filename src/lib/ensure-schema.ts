import { prisma } from "@/lib/prisma";

let ensurePromise: Promise<void> | null = null;

/**
 * Production DBs created before featured/sortOrder will 500 on every Package query.
 * Idempotent ALTER keeps Vercel deploys working without a manual db push.
 */
export function ensureSchema(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      try {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "Package"
          ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false
        `);
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "Package"
          ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0
        `);
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "Package"
          ADD COLUMN IF NOT EXISTS "documentUrl" TEXT
        `);
      } catch (err) {
        // Reset so a later request can retry (e.g. DB was briefly unavailable)
        ensurePromise = null;
        console.error("[ensureSchema] failed:", err);
        throw err;
      }
    })();
  }
  return ensurePromise;
}
