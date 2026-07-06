import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { HomeBanner } from "@/components/HomeBanner";
import { PackageCard } from "@/components/PackageCard";
import { CATEGORY_META } from "@/lib/categories";
import { SITE_NAME } from "@/lib/site-brand";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  const featured = await prisma.package.findMany({
    where: { active: true, category: "tours" },
    take: 3,
    orderBy: { createdAt: "asc" },
  });

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

      <section className="bg-surface px-6 py-20 md:px-8">
        <div className="mx-auto max-w-[980px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-link">{t("featuredLabel")}</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {t("featuredTitle")}
              </h2>
            </div>
            <Link href={CATEGORY_META.tours.path} className="text-sm font-medium text-link hover:text-link-hover">
              {t("viewAllTours")}
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featured.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-20 md:px-8">
        <div className="mx-auto max-w-[980px]">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t("stepsTitle")}
          </h2>
          <ol className="mt-14 grid gap-4 md:grid-cols-4">
            {steps.map((item) => (
              <li
                key={item.step}
                className="rounded-2xl bg-surface p-6 text-center shadow-sm ring-1 ring-black/[0.04]"
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