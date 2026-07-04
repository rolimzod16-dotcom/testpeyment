import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/PackageCard";

const categories = [
  {
    key: "tours",
    title: "Tours",
    description: "Guided international expeditions — nature, culture, adventure.",
    href: "/tours",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  },
  {
    key: "hunting",
    title: "Hunting",
    description: "Licensed game hunting packages with outfitters worldwide.",
    href: "/hunting",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
  },
  {
    key: "survival",
    title: "Survival",
    description: "Professional wilderness skills programs led by certified instructors.",
    href: "/survival",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&q=80",
  },
];

export default async function HomePage() {
  const featured = await prisma.package.findMany({
    where: { active: true },
    take: 3,
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&q=80"
          alt="Mountain wilderness"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/30" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            International Outdoor Expeditions
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-6xl">
            Tours. Hunting. Survival. One trusted operator.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-stone-300">
            Book premium expeditions worldwide. Secure online deposit, automated booking
            confirmation, and instant PDF receipts.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/tours"
              className="rounded-full bg-amber-700 px-6 py-3 font-semibold text-white hover:bg-amber-600"
            >
              Browse Tours
            </Link>
            <Link
              href="/hunting"
              className="rounded-full border border-stone-500 px-6 py-3 font-semibold text-stone-200 hover:border-amber-500 hover:text-amber-400"
            >
              Hunting Packages
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-stone-100">Three Directions. One Platform.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="group relative overflow-hidden rounded-2xl border border-stone-800"
            >
              <div className="relative h-64">
                <Image src={cat.image} alt={cat.title} fill className="object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 to-transparent" />
              </div>
              <div className="absolute bottom-0 p-6">
                <h3 className="text-2xl font-bold text-white">{cat.title}</h3>
                <p className="mt-2 text-sm text-stone-300">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-stone-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-stone-100">Featured Expeditions</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {featured.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-stone-100">How Booking Works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-4">
            {[
              "Choose your expedition",
              "Fill booking details",
              "Pay deposit via PayPal",
              "Receive confirmation & PDF receipt",
            ].map((step, i) => (
              <li key={step} className="rounded-xl border border-stone-800 bg-stone-950/50 p-5">
                <span className="text-2xl font-bold text-amber-600">0{i + 1}</span>
                <p className="mt-2 text-stone-300">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}