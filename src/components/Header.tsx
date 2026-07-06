"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { CATEGORY_META } from "@/lib/categories";
import { SITE_NAME } from "@/lib/site-brand";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const navKeys = ["tours", "hunting", "survival"] as const;

export function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-black/[0.08] bg-white/80 shadow-sm backdrop-blur-xl"
          : "bg-black/20 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-12 max-w-[980px] items-center justify-between gap-3 px-6 md:h-[44px] md:px-8">
        <Link
          href="/"
          className={`shrink-0 text-sm font-semibold tracking-tight transition ${
            scrolled ? "text-foreground" : "text-white"
          }`}
        >
          {SITE_NAME}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={CATEGORY_META[key].path}
              className={`text-xs transition hover:opacity-80 ${
                scrolled ? "text-foreground/80" : "text-white/90"
              }`}
            >
              {t(key)}
            </Link>
          ))}
          <Link
            href="/about"
            className={`text-xs transition hover:opacity-80 ${
              scrolled ? "text-foreground/80" : "text-white/90"
            }`}
          >
            {t("about")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher scrolled={scrolled} />
          <Link
            href="/tours"
            className={`hidden rounded-full px-3.5 py-1 text-xs font-medium transition sm:inline-flex ${
              scrolled
                ? "bg-foreground text-white hover:bg-foreground/90"
                : "bg-white/15 text-white backdrop-blur hover:bg-white/25"
            }`}
          >
            {t("bookTour")}
          </Link>
          <button
            type="button"
            className={`text-xl md:hidden ${scrolled ? "text-foreground" : "text-white"}`}
            aria-label={t("openMenu")}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-black/[0.08] bg-white/95 px-6 py-4 backdrop-blur-xl md:hidden">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={CATEGORY_META[key].path}
              className="block border-b border-black/[0.06] py-3 text-sm text-foreground/80"
              onClick={() => setMenuOpen(false)}
            >
              {t(key)}
            </Link>
          ))}
          <Link
            href="/about"
            className="block border-b border-black/[0.06] py-3 text-sm text-foreground/80"
            onClick={() => setMenuOpen(false)}
          >
            {t("about")}
          </Link>
          <Link
            href="/tours"
            className="mt-4 block rounded-full bg-foreground py-2.5 text-center text-sm font-medium text-white"
            onClick={() => setMenuOpen(false)}
          >
            {t("bookTour")}
          </Link>
        </nav>
      )}
    </header>
  );
}