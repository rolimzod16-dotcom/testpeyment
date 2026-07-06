import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/PackageCard";
import { PageHero } from "@/components/PageHero";

export const metadata = { title: "Tours" };

export default async function ToursPage() {
  const packages = await prisma.package.findMany({
    where: { category: "tours", active: true },
    orderBy: { priceUsd: "asc" },
  });

  return (
    <div>
      <PageHero
        overline="Tour Packages"
        title="International Tours"
        description="Our core offering — curated tour packages for nature, culture, and adventure worldwide."
        image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
      />
      <div className="mx-auto max-w-[980px] bg-background px-6 py-16 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
        {packages.length === 0 && (
          <p className="mt-8 text-[hsl(218,55%,12%)]/50">No packages available yet.</p>
        )}
      </div>
    </div>
  );
}