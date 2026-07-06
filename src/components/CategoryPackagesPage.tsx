import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/PackageCard";
import { PageHero } from "@/components/PageHero";
import { CATEGORY_META } from "@/lib/categories";
import type { PackageCategory } from "@/lib/utils";

type Props = {
  category: PackageCategory;
};

export async function CategoryPackagesPage({ category }: Props) {
  const t = await getTranslations(`categories.${category}`);
  const meta = CATEGORY_META[category];

  const packages = await prisma.package.findMany({
    where: { category, active: true },
    orderBy: { priceUsd: "asc" },
  });

  const countLabel =
    packages.length === 1 ? t("countOne") : t("countMany", { count: packages.length });

  return (
    <div>
      <PageHero
        overline={t("overline")}
        title={t("pageTitle")}
        description={t("description")}
        image={meta.heroImage}
      />

      <div className="mx-auto max-w-[980px] bg-background px-6 py-16 md:px-8">
        {packages.length > 0 ? (
          <>
            <p className="mb-8 text-center text-sm text-muted">{countLabel}</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl bg-surface px-6 py-16 text-center ring-1 ring-black/[0.04]">
            <h2 className="text-xl font-semibold text-foreground">{t("emptyTitle")}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">{t("emptyDescription")}</p>
          </div>
        )}
      </div>
    </div>
  );
}