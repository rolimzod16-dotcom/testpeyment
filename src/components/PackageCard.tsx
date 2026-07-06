import Link from "next/link";
import Image from "next/image";
import type { Package } from "@/generated/prisma/client";
import { getCategoryConfig } from "@/lib/categories";
import { formatCurrency } from "@/lib/utils";

export function PackageCard({ pkg }: { pkg: Package }) {
  const category = getCategoryConfig(pkg.category);

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition hover:shadow-md">
      <div className="relative h-48 overflow-hidden bg-surface">
        <Image
          src={pkg.imageUrl}
          alt={pkg.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            {category.navLabel}
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs font-medium text-muted">{pkg.destination}</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{pkg.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{pkg.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">{pkg.duration}</p>
            <p className="text-base font-semibold text-foreground">{formatCurrency(pkg.priceUsd)}</p>
          </div>
          <Link
            href={`/packages/${pkg.slug}`}
            className="text-sm font-medium text-link hover:text-link-hover"
          >
            Learn more ›
          </Link>
        </div>
      </div>
    </article>
  );
}