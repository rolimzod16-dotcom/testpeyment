"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE_NAME } from "@/lib/site-brand";

const nav = [
  { href: "/hunting", label: "Hunting" },
  { href: "/survival", label: "Survival Challenge" },
  { href: "/tours", label: "Tours" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[hsl(218,60%,8%)]/96 shadow-xl backdrop-blur-md"
          : "bg-[hsl(218,60%,8%)]/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto grid h-[72px] max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 md:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(35,65%,45%)]/20 text-xs font-bold text-[hsl(35,65%,60%)] ring-1 ring-[hsl(35,65%,45%)]/40">
            TP
          </span>
          <span
            className="hidden font-serif text-[0.9rem] font-semibold tracking-[0.06em] sm:block"
            style={{
              background: "linear-gradient(135deg, #f5e6c8 0%, #d4a853 50%, #f5e6c8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {SITE_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/75 transition hover:text-[hsl(35,65%,60%)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/hunting"
            className="hidden rounded-sm bg-[hsl(35,65%,45%)] px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[hsl(35,65%,38%)] sm:inline-flex"
          >
            Book Now
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/15 text-white md:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="text-lg leading-none">{menuOpen ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-white/[0.06] bg-[hsl(218,60%,8%)] px-6 py-4 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block border-b border-white/[0.06] py-3.5 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-white/80"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/hunting"
            className="mt-4 block rounded-sm bg-[hsl(35,65%,45%)] px-5 py-3 text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white"
            onClick={() => setMenuOpen(false)}
          >
            Book Now
          </Link>
        </nav>
      )}
    </header>
  );
}