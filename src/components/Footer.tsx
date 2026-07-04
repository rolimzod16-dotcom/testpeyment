import Link from "next/link";

export function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "WildFrontier Expeditions";
  const email = process.env.COMPANY_EMAIL || "bookings@wildfrontier.com";

  return (
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-400">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-stone-100">{siteName}</p>
          <p className="mt-2 text-sm leading-relaxed">
            Premium international tours, licensed hunting packages, and professional survival
            training programs worldwide.
          </p>
        </div>
        <div>
          <p className="font-semibold text-stone-200">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/tours" className="hover:text-amber-400">Tours</Link>
            <Link href="/hunting" className="hover:text-amber-400">Hunting</Link>
            <Link href="/survival" className="hover:text-amber-400">Survival</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-stone-200">Contact</p>
          <p className="mt-3 text-sm">{email}</p>
          <p className="mt-2 text-sm">Secure online booking & instant receipts</p>
        </div>
      </div>
      <div className="border-t border-stone-800 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </div>
    </footer>
  );
}