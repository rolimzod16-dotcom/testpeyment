import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/BookingForm";
import { formatCurrency, parseJsonArray } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({ where: { slug } });
  return { title: pkg?.title || "Package" };
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({ where: { slug, active: true } });
  if (!pkg) notFound();

  const highlights = parseJsonArray(pkg.highlights);
  const included = parseJsonArray(pkg.included);
  const excluded = parseJsonArray(pkg.excluded);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative h-80 overflow-hidden rounded-2xl sm:h-[28rem]">
            <Image src={pkg.imageUrl} alt={pkg.title} fill className="object-cover" priority />
          </div>
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-stone-100">Overview</h2>
              <p className="mt-2 leading-relaxed text-stone-400">{pkg.longDescription}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-100">Highlights</h2>
              <ul className="mt-2 list-inside list-disc space-y-1 text-stone-400">
                {highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold text-emerald-400">Included</h3>
                <ul className="mt-2 space-y-1 text-sm text-stone-400">
                  {included.map((item) => (
                    <li key={item}>✓ {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-400">Not Included</h3>
                <ul className="mt-2 space-y-1 text-sm text-stone-400">
                  {excluded.map((item) => (
                    <li key={item}>✗ {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-wider text-amber-500">{pkg.category}</p>
          <h1 className="mt-1 text-4xl font-bold text-stone-100">{pkg.title}</h1>
          <p className="mt-2 text-stone-400">{pkg.destination} · {pkg.duration}</p>
          {pkg.species && (
            <p className="mt-1 text-sm text-stone-500">Species: {pkg.species}</p>
          )}
          {pkg.difficulty && (
            <p className="mt-1 text-sm text-stone-500">Level: {pkg.difficulty}</p>
          )}
          <p className="mt-4 text-3xl font-bold text-amber-400">
            {formatCurrency(pkg.priceUsd)} <span className="text-base font-normal text-stone-500">/ person</span>
          </p>
          <div className="mt-8">
            <BookingForm pkg={pkg} />
          </div>
        </div>
      </div>
    </div>
  );
}