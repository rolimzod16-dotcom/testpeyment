export const metadata = { title: "About" };

export default function AboutPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "WildFrontier Expeditions";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold text-stone-100">About {siteName}</h1>
      <div className="mt-8 space-y-4 leading-relaxed text-stone-400">
        <p>
          We are an international outdoor expedition operator specializing in three core
          services: guided tours, licensed game hunting packages, and professional survival
          training programs.
        </p>
        <p>
          Every booking is processed online with secure deposit payment and automatic PDF receipt
          generation. Our partners worldwide hold the required licenses and insurance for each
          activity.
        </p>
        <p>
          For inquiries: {process.env.COMPANY_EMAIL || "bookings@wildfrontier.com"}
        </p>
      </div>
    </div>
  );
}