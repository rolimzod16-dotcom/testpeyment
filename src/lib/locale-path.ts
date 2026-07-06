import { routing, type Locale } from "@/i18n/routing";

export function getLocalePrefix(locale: string): string {
  if (locale === routing.defaultLocale) return "";
  return `/${locale}`;
}

export function buildLocalizedUrl(siteUrl: string, locale: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${getLocalePrefix(locale)}${normalized}`;
}

export function getLocaleFromCookie(cookieHeader: string | null): Locale {
  if (!cookieHeader) return routing.defaultLocale;
  const match = cookieHeader.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  const value = match?.[1];
  if (value && routing.locales.includes(value as Locale)) {
    return value as Locale;
  }
  return routing.defaultLocale;
}