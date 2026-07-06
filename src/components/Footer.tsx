import Link from "next/link";
import { COMPANY_EMAIL, SITE_NAME } from "@/lib/site-brand";

export function Footer() {
  return (
    <footer className="bg-surface text-muted">
      <div className="mx-auto max-w-[980px] px-6 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-foreground">{SITE_NAME}</p>
            <p className="mt-2 text-xs leading-relaxed">
              International tour packages — with licensed hunting and survival challenges as our
              signature experiences.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Explore</p>
            <div className="mt-3 flex flex-col gap-2 text-xs">
              <Link href="/tours" className="hover:text-link">
                Tours
              </Link>
              <Link href="/hunting" className="hover:text-link">
                Hunting
              </Link>
              <Link href="/survival" className="hover:text-link">
                Survival Challenge
              </Link>
              <Link href="/about" className="hover:text-link">
                About
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Contact</p>
            <p className="mt-3 text-xs">{COMPANY_EMAIL}</p>
            <p className="mt-2 text-xs">Secure PayPal checkout · Instant PDF receipts</p>
          </div>
        </div>
        <p className="mt-10 border-t border-black/[0.08] pt-6 text-center text-[11px]">
          Copyright © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}