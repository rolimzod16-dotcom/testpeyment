import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/PackageCard";
import { PageHero } from "@/components/PageHero";
import { CATEGORIES, type CategoryConfig } from "@/lib/categories";
import type { PackageCategory } from "@/lib/utils";

type Props = {
  category: PackageCategory;
};

export async function CategoryPackagesPage({ category }: Props) {
  const config: CategoryConfig = CATEGORIES[category];

  const packages = await prisma.package.findMany({
    where: { category, active: true },
    orderBy: { priceUsd: "asc" },
  });

  return (
    <div>
      <PageHero
        overline={config.overline}
        title={config.pageTitle}
        description={config.description}
        image={config.heroImage}
      />

      <div className="mx-auto max-w-[980px] bg-background px-6 py-16 md:px-8">
        {packages.length > 0 ? (
          <>
            <p className="mb-8 text-center text-sm text-muted">
              {packages.length} {category === "tours" ? "tour" : category === "hunting" ? "hunting" : "survival"}{" "}
              package{packages.length === 1 ? "" : "s"}
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl bg-surface px-6 py-16 text-center ring-1 ring-black/[0.04]">
            <h2 className="text-xl font-semibold text-foreground">{config.emptyTitle}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">{config.emptyDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}