import Link from "next/link";
import Image from "next/image";
import type { Package } from "@/generated/prisma/client";
import { formatCurrency } from "@/lib/utils";

export function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/60 shadow-xl transition hover:-translate-y-1 hover:border-amber-700/50">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={pkg.imageUrl}
          alt={pkg.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute left-4 top-4 rounded-full bg-stone-950/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
          {pkg.category}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-stone-500">{pkg.destination}</p>
        <h3 className="mt-1 text-xl font-semibold text-stone-100">{pkg.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-stone-400">{pkg.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500">{pkg.duration}</p>
            <p className="text-lg font-bold text-amber-400">{formatCurrency(pkg.priceUsd)}</p>
          </div>
          <Link
            href={`/packages/${pkg.slug}`}
            className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}