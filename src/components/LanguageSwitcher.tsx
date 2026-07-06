"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeLabels, locales, type Locale } from "@/i18n/routing";

type Props = {
  scrolled?: boolean;
};

export function LanguageSwitcher({ scrolled = false }: Props) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full p-0.5 ${
        scrolled ? "bg-black/[0.06]" : "bg-white/15 backdrop-blur"
      }`}
    >
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => router.replace(pathname, { locale: code })}
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition ${
            locale === code
              ? scrolled
                ? "bg-foreground text-white"
                : "bg-white text-foreground"
              : scrolled
                ? "text-foreground/60 hover:text-foreground"
                : "text-white/70 hover:text-white"
          }`}
        >
          {localeLabels[code]}
        </button>
      ))}
    </div>
  );
}