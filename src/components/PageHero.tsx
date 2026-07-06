import Image from "next/image";

type Props = {
  overline: string;
  title: string;
  description: string;
  image: string;
};

export function PageHero({ overline, title, description, image }: Props) {
  return (
    <section className="relative flex min-h-[40vh] items-end overflow-hidden bg-black">
      <Image src={image} alt={title} fill priority className="object-cover opacity-80" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-[980px] px-6 py-16 text-center md:px-8 md:py-20">
        <p className="text-sm font-medium text-[#2997ff]">{overline}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">{description}</p>
      </div>
    </section>
  );
}