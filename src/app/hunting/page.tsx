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
        overline="Signature Experience"
        title="Hunting Packages"
        description="Our specialty — licensed hunting expeditions with professional outfitters worldwide."
        image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80"
      />
      <div className="mx-auto max-w-[980px] bg-background px-6 py-16 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </div>
  );
}