import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ensureSchema } from "@/lib/ensure-schema";
import { HomeBanner } from "@/components/HomeBanner";
import { FeaturedCategorySection } from "@/components/FeaturedCategorySection";
import { CATEGORY_META } from "@/lib/categories";
import { SITE_NAME } from "@/lib/site-brand";
import type { PackageCategory } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

async function featuredFor(category: PackageCategory) {
  const featured = await prisma.package.findMany({
    where: { active: true, category, featured: true },
    take: 3,
    orderBy: [{ sortOrder: "asc" }, { priceUsd: "asc" }],
  });
  if (featured.length > 0) return featured;
  return prisma.package.findMany({
    where: { active: true, category },
    take: 3,
    orderBy: [{ sortOrder: "asc" }, { priceUsd: "asc" }],
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  await ensureSchema();

  const [tours, hunting, survival] = await Promise.all([
    featuredFor("tours"),
    featuredFor("hunting"),
    featuredFor("survival"),
  ]);

  const pillars = [
    {
      key: "tours" as const,
      title: t("pillarToursTitle"),
      desc: t("pillarToursDesc"),
      href: CATEGORY_META.tours.path,
      cta: t("pillarToursCta"),
    },
    {
      key: "hunting" as const,
      title: t("pillarHuntingTitle"),
      desc: t("pillarHuntingDesc"),
      href: CATEGORY_META.hunting.path,
      cta: t("pillarHuntingCta"),
    },
    {
      key: "survival" as const,
      title: t("pillarSurvivalTitle"),
      desc: t("pillarSurvivalDesc"),
      href: CATEGORY_META.survival.path,
      cta: t("pillarSurvivalCta"),
    },
  ];

  const steps = [
    { step: "1", title: t("step1Title"), desc: t("step1Desc") },
    { step: "2", title: t("step2Title"), desc: t("step2Desc") },
    { step: "3", title: t("step3Title"), desc: t("step3Desc") },
    { step: "4", title: t("step4Title"), desc: t("step4Desc") },
  ];

  return (
    <div>
      <section className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
        <HomeBanner
          variant="hero"
          eyebrow={t("toursEyebrow")}
          title={t("toursTitle")}
          description={t("toursDescription")}
          href={CATEGORY_META.tours.path}
          cta={t("toursCta")}
          image={CATEGORY_META.tours.heroImage}
        />

        <div className="grid min-h-[48vh] grid-rows-2 lg:min-h-screen">
          <HomeBanner
            variant="tile"
            eyebrow={t("signatureEyebrow")}
            title={t("huntingTitle")}
            href={CATEGORY_META.hunting.path}
            cta={t("huntingCta")}
            image={CATEGORY_META.hunting.heroImage}
          />
          <HomeBanner
            variant="tile"
            eyebrow={t("signatureEyebrow")}
            title={t("survivalTitle")}
            href={CATEGORY_META.survival.path}
            cta={t("survivalCta")}
            image={CATEGORY_META.survival.heroImage}
          />
        </div>
      </section>

      <section className="bg-background px-6 py-20 md:px-8">
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            {t("agencyTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted md:text-xl">
            {t("agencyDescription", { siteName: SITE_NAME })}
          </p>
        </div>
      </section>

      <section className="bg-surface px-6 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-[980px]">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t("pillarsTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted">{t("pillarsSubtitle")}</p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.key}
                className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/[0.04]"
              >
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{pillar.desc}</p>
                <Link
                  href={pillar.href}
                  className="mt-5 text-sm font-medium text-link hover:text-link-hover"
                >
                  {pillar.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-background">
        <FeaturedCategorySection
          category="tours"
          packages={tours}
          labelKey="featuredToursLabel"
          titleKey="featuredToursTitle"
          viewAllKey="viewAllTours"
        />
      </div>
      <div className="bg-surface">
        <FeaturedCategorySection
          category="hunting"
          packages={hunting}
          labelKey="featuredHuntingLabel"
          titleKey="featuredHuntingTitle"
          viewAllKey="viewAllHunting"
        />
      </div>
      <div className="bg-background">
        <FeaturedCategorySection
          category="survival"
          packages={survival}
          labelKey="featuredSurvivalLabel"
          titleKey="featuredSurvivalTitle"
          viewAllKey="viewAllSurvival"
        />
      </div>

      <section className="bg-surface px-6 py-20 md:px-8">
        <div className="mx-auto max-w-[980px]">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t("stepsTitle")}
          </h2>
          <ol className="mt-14 grid gap-4 md:grid-cols-4">
            {steps.map((item) => (
              <li
                key={item.step}
                className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-black/[0.04]"
              >
                <span className="text-2xl font-semibold text-muted">{item.step}</span>
                <p className="mt-3 font-semibold text-foreground">{item.title}</p>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
