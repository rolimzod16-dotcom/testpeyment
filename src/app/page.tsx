import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HomeBanner } from "@/components/HomeBanner";
import { PackageCard } from "@/components/PackageCard";
import { SITE_NAME } from "@/lib/site-brand";

const stats = [
  { value: "12+", label: "Years Experience" },
  { value: "2,400+", label: "Satisfied Clients" },
  { value: "30+", label: "Curated Programs" },
  { value: "4.9★", label: "Average Rating" },
];

export default async function HomePage() {
  const featured = await prisma.package.findMany({
    where: { active: true },
    take: 3,
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <section className="flex min-h-screen flex-col md:flex-row">
        <HomeBanner
          overline="Licensed Expeditions"
          title="Hunting"
          description="Professional game hunting packages with licensed outfitters, expert guides, and premium lodge stays."
          href="/hunting"
          cta="Explore Hunting"
          image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80"
        />
        <HomeBanner
          overline="Professional Training"
          title="Survival Challenge"
          description="Structured wilderness survival programs — bushcraft, navigation, and emergency protocols in real terrain."
          href="/survival"
          cta="Take the Challenge"
          image="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1600&q=80"
          accent="emerald"
        />
      </section>

      <section className="border-y border-[hsl(218,55%,12%)]/10 bg-[hsl(218,60%,8%)] py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4 md:px-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl font-light text-[hsl(35,65%,60%)] md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-white/50">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[hsl(35,65%,45%)]">
            Our Story
          </p>
          <h2 className="font-serif mt-4 max-w-2xl text-4xl font-light leading-tight text-[hsl(218,55%,12%)] md:text-5xl">
            Born from a love of the wild
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[hsl(218,55%,12%)]/70">
            {SITE_NAME} crafts extraordinary hunting expeditions and survival challenges for those who
            travel to be transformed. Every program is built on licensed partners, expert local
            guides, and secure online booking with instant confirmation.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[hsl(35,65%,45%)]">
                Featured
              </p>
              <h2 className="font-serif mt-3 text-3xl font-light text-[hsl(218,55%,12%)] md:text-4xl">
                Curated Expeditions
              </h2>
            </div>
            <Link
              href="/tours"
              className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[hsl(35,65%,45%)] transition hover:text-[hsl(218,55%,12%)]"
            >
              View all tours →
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {featured.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[hsl(35,65%,45%)]">
            Simple Process
          </p>
          <h2 className="font-serif mt-3 text-3xl font-light text-[hsl(218,55%,12%)] md:text-4xl">
            How Booking Works
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              "Choose your expedition",
              "Fill booking details",
              "Pay deposit via PayPal",
              "Receive confirmation & PDF receipt",
            ].map((step, i) => (
              <li
                key={step}
                className="border border-[hsl(218,55%,12%)]/10 bg-white p-6 shadow-sm"
              >
                <span className="font-serif text-3xl font-light text-[hsl(35,65%,45%)]">
                  0{i + 1}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-[hsl(218,55%,12%)]/75">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}