import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/PackageCard";

export const metadata = { title: "Tours" };

export default async function ToursPage() {
  const packages = await prisma.package.findMany({
    where: { category: "tours", active: true },
    orderBy: { priceUsd: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold text-stone-100">International Tours</h1>
      <p className="mt-3 max-w-2xl text-stone-400">
        Guided nature expeditions, cultural journeys, and adventure travel worldwide.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
      {packages.length === 0 && (
        <p className="mt-8 text-stone-500">No packages available yet.</p>
      )}
    </div>
  );
}