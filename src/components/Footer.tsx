import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CATEGORY_META } from "@/lib/categories";
import { COMPANY_EMAIL, SITE_NAME } from "@/lib/site-brand";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <footer className="bg-surface text-muted">
      <div className="mx-auto max-w-[980px] px-6 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-foreground">{SITE_NAME}</p>
            <p className="mt-2 text-xs leading-relaxed">{t("tagline")}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">{t("explore")}</p>
            <div className="mt-3 flex flex-col gap-2 text-xs">
              <Link href={CATEGORY_META.tours.path} className="hover:text-link">
                {tNav("tours")}
              </Link>
              <Link href={CATEGORY_META.hunting.path} className="hover:text-link">
                {tNav("hunting")}
              </Link>
              <Link href={CATEGORY_META.survival.path} className="hover:text-link">
                {tNav("survival")}
              </Link>
              <Link href="/about" className="hover:text-link">
                {tCommon("about")}
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">{t("contact")}</p>
            <p className="mt-3 text-xs">{COMPANY_EMAIL}</p>
            <p className="mt-2 text-xs">{t("checkout")}</p>
          </div>
        </div>
        <p className="mt-10 border-t border-black/[0.08] pt-6 text-center text-[11px]">
          {t("copyright", { year: new Date().getFullYear(), siteName: SITE_NAME })}
        </p>
      </div>
    </footer>
  );
}