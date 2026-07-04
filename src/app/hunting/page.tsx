import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/PackageCard";

export const metadata = { title: "Hunting" };

export default async function HuntingPage() {
  const packages = await prisma.package.findMany({
    where: { category: "hunting", active: true },
    orderBy: { priceUsd: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold text-stone-100">Game Hunting Packages</h1>
      <p className="mt-3 max-w-2xl text-stone-400">
        Licensed hunting expeditions with professional outfitters. Permits, guides, and lodge
        accommodation arranged through verified local partners.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
}