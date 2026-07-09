import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PackageCard } from "@/components/PackageCard";
import { CATEGORY_META } from "@/lib/categories";
import type { PackageCategory } from "@/lib/utils";
import type { Package } from "@/generated/prisma/client";

type Props = {
  category: PackageCategory;
  packages: Package[];
  labelKey: "featuredToursLabel" | "featuredHuntingLabel" | "featuredSurvivalLabel";
  titleKey: "featuredToursTitle" | "featuredHuntingTitle" | "featuredSurvivalTitle";
  viewAllKey: "viewAllTours" | "viewAllHunting" | "viewAllSurvival";
};

export async function FeaturedCategorySection({
  category,
  packages,
  labelKey,
  titleKey,
  viewAllKey,
}: Props) {
  const t = await getTranslations("home");
  const meta = CATEGORY_META[category];

  if (packages.length === 0) return null;

  return (
    <section className="px-6 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-[980px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-link">{t(labelKey)}</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {t(titleKey)}
            </h2>
          </div>
          <Link
            href={meta.path}
            className="text-sm font-medium text-link transition hover:text-link-hover"
          >
            {t(viewAllKey)}
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
