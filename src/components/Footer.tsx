import Link from "next/link";
import { COMPANY_EMAIL, SITE_NAME, SITE_TAGLINE } from "@/lib/site-brand";

export function Footer() {
  return (
    <footer className="bg-[hsl(218,60%,8%)] text-white/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3 md:px-10">
        <div>
          <p
            className="font-serif text-lg font-semibold tracking-wide"
            style={{
              background: "linear-gradient(135deg, #f5e6c8 0%, #d4a853 50%, #f5e6c8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {SITE_NAME}
          </p>
          <p className="mt-3 text-sm leading-relaxed">{SITE_TAGLINE}</p>
          <p className="mt-2 text-sm leading-relaxed">
            Premium hunting expeditions and professional survival challenges worldwide.
            Secure online booking and instant receipts.
          </p>
        </div>
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[hsl(35,65%,60%)]">
            Explore
          </p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            <Link href="/hunting" className="transition hover:text-[hsl(35,65%,60%)]">
              Hunting
            </Link>
            <Link href="/survival" className="transition hover:text-[hsl(35,65%,60%)]">
              Survival Challenge
            </Link>
            <Link href="/tours" className="transition hover:text-[hsl(35,65%,60%)]">
              Tours
            </Link>
            <Link href="/about" className="transition hover:text-[hsl(35,65%,60%)]">
              About
            </Link>
          </div>
        </div>
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[hsl(35,65%,60%)]">
            Contact
          </p>
          <p className="mt-4 text-sm">{COMPANY_EMAIL}</p>
          <p className="mt-2 text-sm">Secure PayPal checkout · PDF receipts</p>
        </div>
      </div>
      <div className="border-t border-white/[0.06] py-5 text-center text-xs tracking-wide text-white/40">
        © {new Date().getFullYear()} {SITE_NAME} · All rights reserved
      </div>
    </footer>
  );
}