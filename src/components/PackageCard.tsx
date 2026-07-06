import Link from "next/link";
import Image from "next/image";
import type { Package } from "@/generated/prisma/client";
import { formatCurrency } from "@/lib/utils";

export function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <article className="group overflow-hidden border border-[hsl(218,55%,12%)]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={pkg.imageUrl}
          alt={pkg.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute left-4 top-4 bg-[hsl(218,60%,8%)]/80 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[hsl(35,65%,60%)]">
          {pkg.category}
        </span>
      </div>
      <div className="p-5">
        <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[hsl(218,55%,12%)]/45">
          {pkg.destination}
        </p>
        <h3 className="font-serif mt-1 text-xl font-medium text-[hsl(218,55%,12%)]">{pkg.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[hsl(218,55%,12%)]/65">
          {pkg.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[hsl(218,55%,12%)]/45">{pkg.duration}</p>
            <p className="font-serif text-lg font-medium text-[hsl(35,65%,45%)]">
              {formatCurrency(pkg.priceUsd)}
            </p>
          </div>
          <Link
            href={`/packages/${pkg.slug}`}
            className="bg-[hsl(35,65%,45%)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[hsl(35,65%,38%)]"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}