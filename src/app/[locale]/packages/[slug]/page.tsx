import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ensureSchema } from "@/lib/ensure-schema";
import { BookingForm } from "@/components/BookingForm";
import { PackageCard } from "@/components/PackageCard";
import { getCategoryMeta } from "@/lib/categories";
import { formatCurrency, parseJsonArray, type PackageCategory } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    await ensureSchema();
    const pkg = await prisma.package.findUnique({ where: { slug } });
    return { title: pkg?.title || "Package" };
  } catch {
    return { title: "Package" };
  }
}

export default async function PackagePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("package");
  await ensureSchema();
  const pkg = await prisma.package.findUnique({ where: { slug, active: true } });
  if (!pkg) notFound();

  const meta = getCategoryMeta(pkg.category);
  const categoryT = meta
    ? await getTranslations(`categories.${pkg.category as PackageCategory}`)
    : null;
  const categoryLabel = categoryT ? categoryT("pageTitle") : pkg.category;

  const highlights = parseJsonArray(pkg.highlights);
  const included = parseJsonArray(pkg.included);
  const excluded = parseJsonArray(pkg.excluded);

  const related = await prisma.package.findMany({
    where: { category: pkg.category, active: true, slug: { not: pkg.slug } },
    take: 3,
    orderBy: [{ sortOrder: "asc" }, { priceUsd: "asc" }],
  });

  const metaBits = [
    pkg.destination,
    pkg.duration,
    pkg.maxGuests ? t("maxGuests", { count: pkg.maxGuests }) : null,
    pkg.difficulty ? `${t("level")}: ${pkg.difficulty}` : null,
    pkg.species ? `${t("species")}: ${pkg.species}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-[980px] px-6 py-8 md:px-8 md:py-12">
        {meta && (
          <nav className="mb-6 text-sm">
            <Link href={meta.path} className="font-medium text-link hover:text-link-hover">
              {t("backTo", { category: categoryLabel })}
            </Link>
          </nav>
        )}

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="relative h-80 overflow-hidden rounded-2xl bg-surface sm:h-[28rem]">
              <Image src={pkg.imageUrl} alt={pkg.title} fill className="object-cover" priority />
            </div>
            <div className="mt-8 space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{t("overview")}</h2>
                <p className="mt-2 leading-relaxed text-muted">{pkg.longDescription}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{t("highlights")}</h2>
                <ul className="mt-3 space-y-2">
                  {highlights.map((item) => (
                    <li key={item} className="flex gap-2 text-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-link" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl bg-surface/80 p-4 ring-1 ring-black/[0.04]">
                  <h3 className="font-medium text-emerald-700">{t("included")}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted">
                    {included.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-emerald-600">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-surface/80 p-4 ring-1 ring-black/[0.04]">
                  <h3 className="font-medium text-red-600">{t("notIncluded")}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted">
                    {excluded.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-red-500">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-20 lg:self-start">
            {categoryT && (
              <p className="text-sm font-medium text-link">{categoryT("navLabel")}</p>
            )}
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {pkg.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">{metaBits.join(" · ")}</p>
            <p className="mt-5 text-3xl font-semibold text-foreground">
              {formatCurrency(pkg.priceUsd)}{" "}
              <span className="text-base font-normal text-muted">{t("perPerson")}</span>
            </p>
            {pkg.documentUrl && (
              <a
                href={pkg.documentUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex text-sm font-medium text-link hover:text-link-hover"
              >
                {t("downloadDoc")} ›
              </a>
            )}
            <div className="mt-8">
              <BookingForm pkg={pkg} />
            </div>
          </div>
        </div>

        {related.length > 0 && meta && (
          <section className="mt-16 border-t border-black/[0.06] pt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("moreFrom", { category: categoryT ? categoryT("navLabel") : pkg.category })}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <PackageCard key={item.id} pkg={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
