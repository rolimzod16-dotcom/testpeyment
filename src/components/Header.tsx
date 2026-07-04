import Link from "next/link";

const nav = [
  { href: "/tours", label: "Tours" },
  { href: "/hunting", label: "Hunting" },
  { href: "/survival", label: "Survival" },
  { href: "/about", label: "About" },
];

export function Header() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "WildFrontier Expeditions";

  return (
    <header className="sticky top-0 z-50 border-b border-stone-800/50 bg-stone-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-700 text-sm font-bold text-white">
            WF
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide text-stone-100">{siteName}</p>
            <p className="text-xs text-stone-400">International Outdoor Expeditions</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-stone-300 transition hover:text-amber-400"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}