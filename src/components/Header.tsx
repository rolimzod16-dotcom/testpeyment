"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { SITE_NAME } from "@/lib/site-brand";

const nav = [
  CATEGORIES.tours,
  CATEGORIES.hunting,
  CATEGORIES.survival,
].map((c) => ({ href: c.path, label: c.navLabel }));

export function Header() {
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
      <div className="mx-auto flex h-12 max-w-[980px] items-center justify-between px-6 md:h-[44px] md:px-8">
        <Link
          href="/"
          className={`text-sm font-semibold tracking-tight transition ${
            scrolled ? "text-foreground" : "text-white"
          }`}
        >
          {SITE_NAME}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs transition hover:opacity-80 ${
                scrolled ? "text-foreground/80" : "text-white/90"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/tours"
            className={`hidden rounded-full px-3.5 py-1 text-xs font-medium transition md:inline-flex ${
              scrolled
                ? "bg-foreground text-white hover:bg-foreground/90"
                : "bg-white/15 text-white backdrop-blur hover:bg-white/25"
            }`}
          >
            Book a tour
          </Link>
          <button
            type="button"
            className={`text-xl md:hidden ${scrolled ? "text-foreground" : "text-white"}`}
            aria-label="Open menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-black/[0.08] bg-white/95 px-6 py-4 backdrop-blur-xl md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block border-b border-black/[0.06] py-3 text-sm text-foreground/80"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/tours"
            className="mt-4 block rounded-full bg-foreground py-2.5 text-center text-sm font-medium text-white"
            onClick={() => setMenuOpen(false)}
          >
            Book a tour
          </Link>
        </nav>
      )}
    </header>
  );
}