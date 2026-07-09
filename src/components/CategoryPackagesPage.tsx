import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ensureSchema } from "@/lib/ensure-schema";
import { PackageCard } from "@/components/PackageCard";
import { PageHero } from "@/components/PageHero";
import { CATEGORY_META } from "@/lib/categories";
import type { PackageCategory } from "@/lib/utils";

type Props = {
  category: PackageCategory;
  sort?: string;
};

export async function CategoryPackagesPage({ category, sort }: Props) {
  const t = await getTranslations(`categories.${category}`);
  const meta = CATEGORY_META[category];

  await ensureSchema();

  const orderBy =
    sort === "price-desc"
      ? [{ priceUsd: "desc" as const }]
      : [{ sortOrder: "asc" as const }, { priceUsd: "asc" as const }];

  const packages = await prisma.package.findMany({
    where: { category, active: true },
    orderBy,
  });

  const countLabel =
    packages.length === 1 ? t("countOne") : t("countMany", { count: packages.length });

  const path = meta.path;
  const isPriceDesc = sort === "price-desc";

  return (
    <div>
      <PageHero
        overline={t("overline")}
        title={t("pageTitle")}
        description={t("description")}
        image={meta.heroImage}
      />

      <div className="mx-auto max-w-[980px] bg-background px-6 py-16 md:px-8">
        <div className="mx-auto mb-10 max-w-2xl rounded-2xl bg-surface px-6 py-5 text-center ring-1 ring-black/[0.04]">
          <p className="text-sm leading-relaxed text-muted">{t("forWho")}</p>
        </div>

        {packages.length > 0 ? (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">{countLabel}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href={path}
                  className={`rounded-full px-3 py-1.5 transition ${
                    !isPriceDesc
                      ? "bg-foreground text-white"
                      : "bg-surface text-muted ring-1 ring-black/[0.06] hover:text-foreground"
                  }`}
                >
                  {t("sortPriceAsc")}
                </Link>
                <Link
                  href={{ pathname: path, query: { sort: "price-desc" } }}
                  className={`rounded-full px-3 py-1.5 transition ${
                    isPriceDesc
                      ? "bg-foreground text-white"
                      : "bg-surface text-muted ring-1 ring-black/[0.06] hover:text-foreground"
                  }`}
                >
                  {t("sortPriceDesc")}
                </Link>
              </div>
            </div>
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
