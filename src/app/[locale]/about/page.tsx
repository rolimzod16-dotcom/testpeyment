import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
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

  return (
    <div>
      <PageHero
        overline={t("title")}
        title={SITE_NAME}
        description={t("heroDescription")}
        image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80"
      />
      <div className="mx-auto max-w-[680px] px-6 py-16 md:px-8">
        <div className="space-y-5 text-base leading-relaxed text-muted">
          <p>{t("p1", { siteName: SITE_NAME })}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
          <p>
            <a href={`mailto:${COMPANY_EMAIL}`} className="font-medium text-link hover:text-link-hover">
              {COMPANY_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}