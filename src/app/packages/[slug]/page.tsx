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
    <div className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="relative h-80 overflow-hidden sm:h-[28rem]">
              <Image src={pkg.imageUrl} alt={pkg.title} fill className="object-cover" priority />
            </div>
            <div className="mt-8 space-y-6">
              <div>
                <h2 className="font-serif text-lg font-medium text-[hsl(218,55%,12%)]">Overview</h2>
                <p className="mt-2 leading-relaxed text-[hsl(218,55%,12%)]/70">{pkg.longDescription}</p>
              </div>
              <div>
                <h2 className="font-serif text-lg font-medium text-[hsl(218,55%,12%)]">Highlights</h2>
                <ul className="mt-2 list-inside list-disc space-y-1 text-[hsl(218,55%,12%)]/70">
                  {highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-medium text-emerald-700">Included</h3>
                  <ul className="mt-2 space-y-1 text-sm text-[hsl(218,55%,12%)]/70">
                    {included.map((item) => (
                      <li key={item}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-red-700">Not Included</h3>
                  <ul className="mt-2 space-y-1 text-sm text-[hsl(218,55%,12%)]/70">
                    {excluded.map((item) => (
                      <li key={item}>✗ {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-[hsl(35,65%,45%)]">
              {pkg.category}
            </p>
            <h1 className="font-serif mt-1 text-4xl font-light text-[hsl(218,55%,12%)]">{pkg.title}</h1>
            <p className="mt-2 text-[hsl(218,55%,12%)]/65">
              {pkg.destination} · {pkg.duration}
            </p>
            {pkg.species && (
              <p className="mt-1 text-sm text-[hsl(218,55%,12%)]/50">Species: {pkg.species}</p>
            )}
            {pkg.difficulty && (
              <p className="mt-1 text-sm text-[hsl(218,55%,12%)]/50">Level: {pkg.difficulty}</p>
            )}
            <p className="font-serif mt-4 text-3xl font-medium text-[hsl(35,65%,45%)]">
              {formatCurrency(pkg.priceUsd)}{" "}
              <span className="text-base font-normal text-[hsl(218,55%,12%)]/50">/ person</span>
            </p>
            <div className="mt-8">
              <BookingForm pkg={pkg} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}