import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Package } from "@/generated/prisma/client";
import { getCategoryMeta } from "@/lib/categories";
import { formatCurrency, type PackageCategory } from "@/lib/utils";

export async function PackageCard({ pkg }: { pkg: Package }) {
  const t = await getTranslations("package");
  const meta = getCategoryMeta(pkg.category);
  const categoryT = meta
    ? await getTranslations(`categories.${pkg.category as PackageCategory}`)
    : null;
  const categoryLabel = categoryT ? categoryT("navLabel") : pkg.category;

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden bg-surface">
        <Image
          src={pkg.imageUrl}
          alt={pkg.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-2 p-3">
          <span className="rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            {categoryLabel}
          </span>
          {pkg.difficulty && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/80 backdrop-blur-sm">
              {pkg.difficulty}
            </span>
          )}
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs font-medium text-muted">{pkg.destination}</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{pkg.title}</h3>
        {pkg.species && (
          <p className="mt-1 text-xs font-medium text-link">
            {t("species")}: {pkg.species}
          </p>
        )}
        <p className="mt-2 line-clamp-2 text-sm text-muted">{pkg.description}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted">{pkg.duration}</p>
            <p className="mt-0.5 text-base font-semibold text-foreground">
              {formatCurrency(pkg.priceUsd)}{" "}
              <span className="text-xs font-normal text-muted">{t("perPerson")}</span>
            </p>
          </div>
          <Link
            href={`/packages/${pkg.slug}`}
            className="shrink-0 text-sm font-medium text-link transition hover:text-link-hover"
          >
            {t("learnMore")}
          </Link>
        </div>
      </div>
    </article>
  );
}
