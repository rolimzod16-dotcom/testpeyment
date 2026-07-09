import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/PageHero";
import { CATEGORY_META } from "@/lib/categories";
import { COMPANY_EMAIL, SITE_NAME } from "@/lib/site-brand";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const pillars = [
    {
      title: t("pillarToursTitle"),
      body: t("pillarToursBody"),
      href: CATEGORY_META.tours.path,
      cta: t("pillarToursCta"),
    },
    {
      title: t("pillarHuntingTitle"),
      body: t("pillarHuntingBody"),
      href: CATEGORY_META.hunting.path,
      cta: t("pillarHuntingCta"),
    },
    {
      title: t("pillarSurvivalTitle"),
      body: t("pillarSurvivalBody"),
      href: CATEGORY_META.survival.path,
      cta: t("pillarSurvivalCta"),
    },
  ];

  return (
    <div>
      <PageHero
        overline={t("title")}
        title={SITE_NAME}
        description={t("heroDescription")}
        image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80"
      />
      <div className="mx-auto max-w-[980px] px-6 py-16 md:px-8">
        <div className="mx-auto max-w-[680px] space-y-5 text-base leading-relaxed text-muted">
          <p>{t("p1", { siteName: SITE_NAME })}</p>
          <p>{t("p2")}</p>
        </div>

        <h2 className="mt-16 text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {t("pillarsTitle")}
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col rounded-2xl bg-surface p-6 ring-1 ring-black/[0.04]"
            >
              <h3 className="text-lg font-semibold text-foreground">{pillar.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{pillar.body}</p>
              <Link
                href={pillar.href}
                className="mt-5 text-sm font-medium text-link hover:text-link-hover"
              >
                {pillar.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-[680px] rounded-2xl bg-surface px-6 py-8 ring-1 ring-black/[0.04]">
          <h2 className="text-xl font-semibold text-foreground">{t("bookingTitle")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t("bookingBody")}</p>
          <p className="mt-6 text-sm text-muted">
            <a href={`mailto:${COMPANY_EMAIL}`} className="font-medium text-link hover:text-link-hover">
              {COMPANY_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
