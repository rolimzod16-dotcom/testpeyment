import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/PackageCard";
import { PageHero } from "@/components/PageHero";

export const metadata = { title: "Hunting" };

export default async function HuntingPage() {
  const packages = await prisma.package.findMany({
    where: { category: "hunting", active: true },
    orderBy: { priceUsd: "asc" },
  });

  return (
    <div>
      <PageHero
        overline="Licensed Expeditions"
        title="Game Hunting Packages"
        description="Licensed hunting expeditions with professional outfitters. Permits, guides, and lodge accommodation arranged through verified local partners."
        image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80"
      />
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </div>
  );
}