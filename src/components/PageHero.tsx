import Image from "next/image";

type Props = {
  overline: string;
  title: string;
  description: string;
  image: string;
};

export function PageHero({ overline, title, description, image }: Props) {
  return (
    <section className="relative flex min-h-[42vh] items-end overflow-hidden bg-[hsl(218,60%,8%)]">
      <Image src={image} alt={title} fill priority className="object-cover opacity-50" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(218,60%,8%)] via-[hsl(218,60%,8%)]/80 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[hsl(35,65%,60%)] md:text-xs">
          {overline}
        </p>
        <h1 className="font-serif mt-4 max-w-3xl text-4xl font-light leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-white/65 md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}