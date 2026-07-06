import { PageHero } from "@/components/PageHero";
import { COMPANY_EMAIL, SITE_NAME } from "@/lib/site-brand";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div>
      <PageHero
        overline="Our Story"
        title={`About ${SITE_NAME}`}
        description="Premium hunting expeditions and survival challenges for those who travel to be transformed."
        image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80"
      />
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
        <div className="space-y-5 leading-relaxed text-[hsl(218,55%,12%)]/75">
          <p>
            We are an international outdoor expedition operator specializing in licensed game
            hunting packages and professional survival training programs.
          </p>
          <p>
            Every booking is processed online with secure deposit payment and automatic PDF receipt
            generation. Our partners worldwide hold the required licenses and insurance for each
            activity.
          </p>
          <p>
            For inquiries:{" "}
            <a href={`mailto:${COMPANY_EMAIL}`} className="text-[hsl(35,65%,45%)] hover:underline">
              {COMPANY_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}