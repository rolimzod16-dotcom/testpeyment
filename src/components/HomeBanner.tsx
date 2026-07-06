import Image from "next/image";
import Link from "next/link";

type Props = {
  overline: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  image: string;
  accent?: "gold" | "emerald";
};

export function HomeBanner({
  overline,
  title,
  description,
  href,
  cta,
  image,
  accent = "gold",
}: Props) {
  const accentBorder = accent === "gold" ? "border-[hsl(35,65%,45%)]" : "border-emerald-500/60";

  return (
    <Link
      href={href}
      className="group relative flex min-h-[50vh] flex-1 flex-col justify-end overflow-hidden md:min-h-screen"
    >
      <Image
        src={image}
        alt={title}
        fill
        priority
        className="object-cover transition duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(218,60%,8%)] via-[hsl(218,60%,8%)]/55 to-[hsl(218,60%,8%)]/20" />
      <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/10" />

      <div className="relative z-10 p-8 pb-12 md:p-12 md:pb-16 lg:p-14">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[hsl(35,65%,60%)] md:text-xs">
          {overline}
        </p>
        <h2 className="font-serif mt-4 max-w-md text-4xl font-light leading-[0.95] tracking-tight text-white md:text-5xl lg:text-6xl">
          {title}
        </h2>
        <p className="mt-4 max-w-sm text-sm font-light leading-relaxed tracking-wide text-white/65 md:text-base">
          {description}
        </p>
        <span
          className={`mt-8 inline-flex items-center gap-2 border-b pb-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[hsl(35,65%,60%)] transition group-hover:text-white ${accentBorder}`}
        >
          {cta}
          <span aria-hidden className="transition group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}