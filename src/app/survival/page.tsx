import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/PackageCard";
import { PageHero } from "@/components/PageHero";

export const metadata = { title: "Survival Challenge" };

export default async function SurvivalPage() {
  const packages = await prisma.package.findMany({
    where: { category: "survival", active: true },
    orderBy: { priceUsd: "asc" },
  });

  return (
    <div>
      <PageHero
        overline="Professional Training"
        title="Survival Challenge"
        description="Professional wilderness skills courses — bushcraft, navigation, emergency protocols. Structured programs in real terrain."
        image="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1600&q=80"
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