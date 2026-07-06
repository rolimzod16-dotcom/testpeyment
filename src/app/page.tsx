import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HomeBanner } from "@/components/HomeBanner";
import { PackageCard } from "@/components/PackageCard";
import { SITE_NAME } from "@/lib/site-brand";

export default async function HomePage() {
  const featured = await prisma.package.findMany({
    where: { active: true, category: "tours" },
    take: 3,
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      {/* 3-panel hero: Tours (left) + Hunting & Survival (right) */}
      <section className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
        <HomeBanner
          variant="hero"
          eyebrow="Tour Packages"
          title="Explore the world."
          description="Curated international journeys. Book online, travel with confidence."
          href="/tours"
          cta="Browse tours"
          image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
        />

        <div className="grid min-h-[48vh] grid-rows-2 lg:min-h-screen">
          <HomeBanner
            variant="tile"
            eyebrow="Signature"
            title="Hunting"
            href="/hunting"
            cta="Explore hunting"
            image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80"
          />
          <HomeBanner
            variant="tile"
            eyebrow="Signature"
            title="Survival Challenge"
            href="/survival"
            cta="Take the challenge"
            image="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1600&q=80"
          />
        </div>
      </section>

      <section className="bg-background px-6 py-20 md:px-8">
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            A tour agency with something extra.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted md:text-xl">
            {SITE_NAME} is built around international tour packages — plus licensed hunting
            expeditions and survival challenges for travelers who want more than a standard trip.
          </p>
        </div>
      </section>

      <section className="bg-surface px-6 py-20 md:px-8">
        <div className="mx-auto max-w-[980px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-link">Tour Packages</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Featured tours
              </h2>
            </div>
            <Link href="/tours" className="text-sm font-medium text-link hover:text-link-hover">
              View all tours ›
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featured.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-20 md:px-8">
        <div className="mx-auto max-w-[980px]">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Book in four simple steps.
          </h2>
          <ol className="mt-14 grid gap-4 md:grid-cols-4">
            {[
              { step: "1", title: "Pick a package", desc: "Tours, hunting, or survival." },
              { step: "2", title: "Enter details", desc: "Dates, guests, contact info." },
              { step: "3", title: "Pay deposit", desc: "Secure checkout via PayPal." },
              { step: "4", title: "Get confirmed", desc: "Instant confirmation & PDF receipt." },
            ].map((item) => (
              <li
                key={item.step}
                className="rounded-2xl bg-surface p-6 text-center shadow-sm ring-1 ring-black/[0.04]"
              >
                <span className="text-2xl font-semibold text-muted">{item.step}</span>
                <p className="mt-3 font-semibold text-foreground">{item.title}</p>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}