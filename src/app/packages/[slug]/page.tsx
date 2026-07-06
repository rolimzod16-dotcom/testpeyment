import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/BookingForm";
import { PackageCard } from "@/components/PackageCard";
import { getCategoryConfig } from "@/lib/categories";
import { formatCurrency, parseJsonArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({ where: { slug } });
  return { title: pkg?.title || "Package" };
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({ where: { slug, active: true } });
  if (!pkg) notFound();

  const category = getCategoryConfig(pkg.category);
  const highlights = parseJsonArray(pkg.highlights);
  const included = parseJsonArray(pkg.included);
  const excluded = parseJsonArray(pkg.excluded);

  const related = await prisma.package.findMany({
    where: { category: pkg.category, active: true, slug: { not: pkg.slug } },
    take: 3,
    orderBy: { priceUsd: "asc" },
  });

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-[980px] px-6 py-8 md:px-8 md:py-12">
        {category && (
          <nav className="mb-6 text-sm">
            <Link href={category.path} className="font-medium text-link hover:text-link-hover">
              ← Back to {category.pageTitle}
            </Link>
          </nav>
        )}

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="relative h-80 overflow-hidden rounded-2xl bg-surface sm:h-[28rem]">
              <Image src={pkg.imageUrl} alt={pkg.title} fill className="object-cover" priority />
            </div>
            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Overview</h2>
                <p className="mt-2 leading-relaxed text-muted">{pkg.longDescription}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Highlights</h2>
                <ul className="mt-2 list-inside list-disc space-y-1 text-muted">
                  {highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-medium text-emerald-700">Included</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    {included.map((item) => (
                      <li key={item}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-red-600">Not Included</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    {excluded.map((item) => (
                      <li key={item}>✗ {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            {category && (
              <p className="text-sm font-medium text-link">{category.navLabel}</p>
            )}
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {pkg.title}
            </h1>
            <p className="mt-2 text-muted">
              {pkg.destination} · {pkg.duration}
            </p>
            {pkg.species && <p className="mt-1 text-sm text-muted">Species: {pkg.species}</p>}
            {pkg.difficulty && <p className="mt-1 text-sm text-muted">Level: {pkg.difficulty}</p>}
            <p className="mt-4 text-3xl font-semibold text-foreground">
              {formatCurrency(pkg.priceUsd)}{" "}
              <span className="text-base font-normal text-muted">/ person</span>
            </p>
            <div className="mt-8">
              <BookingForm pkg={pkg} />
            </div>
          </div>
        </div>

        {related.length > 0 && category && (
          <section className="mt-16 border-t border-black/[0.06] pt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              More {category.navLabel.toLowerCase()}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <PackageCard key={item.id} pkg={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}