import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ru", "tg"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  tg: "TJ",
};