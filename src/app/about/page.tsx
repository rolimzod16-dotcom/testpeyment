import { PageHero } from "@/components/PageHero";
import { COMPANY_EMAIL, SITE_NAME } from "@/lib/site-brand";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div>
      <PageHero
        overline="About"
        title={SITE_NAME}
        description="An international tour agency — with hunting and survival challenges as our signature edge."
        image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80"
      />
      <div className="mx-auto max-w-[680px] px-6 py-16 md:px-8">
        <div className="space-y-5 text-base leading-relaxed text-muted">
          <p>
            {SITE_NAME} is primarily a tour package agency. We design and book international
            journeys — nature expeditions, cultural trips, and adventure travel worldwide.
          </p>
          <p>
            What sets us apart are two signature experiences: licensed hunting expeditions and
            professional survival challenges. They are the twist on top of a full-service tour
            operation.
          </p>
          <p>
            Every booking is processed online with secure deposit payment and automatic PDF receipt
            generation.
          </p>
          <p>
            <a href={`mailto:${COMPANY_EMAIL}`} className="font-medium text-link hover:text-link-hover">
              {COMPANY_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}