import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Props = {
  variant: "hero" | "tile";
  eyebrow?: string;
  title: string;
  description?: string;
  href: string;
  cta: string;
  image: string;
};

export function HomeBanner({
  variant,
  eyebrow,
  title,
  description,
  href,
  cta,
  image,
}: Props) {
  if (variant === "hero") {
    return (
      <Link
        href={href}
        className="group relative flex min-h-[52vh] flex-col items-center justify-end overflow-hidden bg-black text-center lg:min-h-screen"
      >
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="object-cover opacity-90 transition duration-700 group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

        <div className="relative z-10 px-6 pb-14 pt-24 md:px-10 md:pb-20">
          {eyebrow && <p className="text-sm font-medium text-[#2997ff]">{eyebrow}</p>}
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white md:text-6xl lg:text-7xl">
            {title}
          </h1>
          {description && (
            <p className="mx-auto mt-4 max-w-lg text-lg font-normal text-white/75 md:text-xl">
              {description}
            </p>
          )}
          <p className="mt-6 text-lg font-medium text-[#2997ff] transition group-hover:text-[#0077ed]">
            {cta} <span aria-hidden>›</span>
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group relative flex min-h-[28vh] flex-col items-center justify-end overflow-hidden bg-black text-center lg:min-h-0 lg:flex-1"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover opacity-85 transition duration-700 group-hover:scale-[1.03]"
        sizes="(max-width: 1024px) 100vw, 42vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

      <div className="relative z-10 px-5 pb-8 pt-16 md:px-6 md:pb-10">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-white/55">{eyebrow}</p>
        )}
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h2>
        <p className="mt-3 text-sm font-medium text-[#2997ff] transition group-hover:text-[#0077ed] md:text-base">
          {cta} <span aria-hidden>›</span>
        </p>
      </div>
    </Link>
  );
}