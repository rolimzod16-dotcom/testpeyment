import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const packages = [
  {
    slug: "patagonia-wilderness-trek",
    title: "Patagonia Wilderness Trek",
    category: "tours",
    description: "Multi-day guided trek through Torres del Paine with glacier views and premium lodges.",
    longDescription:
      "Experience the raw beauty of Patagonia on this expertly guided expedition. Cross iconic trails, camp under southern skies, and explore glaciers with certified mountain guides. Designed for adventurous travelers who want comfort without sacrificing wilderness authenticity.",
    destination: "Chile — Patagonia",
    duration: "8 days / 7 nights",
    difficulty: "Moderate",
    priceUsd: 2890,
    depositPercent: 30,
    maxGuests: 10,
    imageUrl: "https://images.unsplash.com/photo-1518091464577-65227db406a6?w=1200&q=80",
    highlights: JSON.stringify([
      "Torres del Paine circuit highlights",
      "Professional English-speaking guides",
      "Lodge and eco-camp accommodation",
      "All meals and park permits included",
    ]),
    included: JSON.stringify([
      "Airport transfers",
      "Accommodation",
      "All meals",
      "Park fees",
      "Guide services",
    ]),
    excluded: JSON.stringify(["International flights", "Travel insurance", "Personal gear"]),
  },
  {
    slug: "scandinavian-fjord-expedition",
    title: "Scandinavian Fjord Expedition",
    category: "tours",
    description: "Sail and hike Norway's fjords with wildlife watching and coastal village stays.",
    longDescription:
      "A premium nature tour combining fjord cruising, coastal hiking, and authentic Nordic culture. Perfect for international travelers seeking scenic adventure without extreme physical demands.",
    destination: "Norway — Western Fjords",
    duration: "6 days / 5 nights",
    difficulty: "Easy",
    priceUsd: 2190,
    depositPercent: 30,
    maxGuests: 14,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    highlights: JSON.stringify([
      "Private fjord boat excursions",
      "Puffin and eagle watching",
      "Historic fishing villages",
      "Comfortable boutique hotels",
    ]),
    included: JSON.stringify(["Boat trips", "Hotels", "Breakfast & lunch", "Local guides"]),
    excluded: JSON.stringify(["Flights", "Dinner (except day 1)", "Alcoholic beverages"]),
  },
  {
    slug: "red-stag-scotland-hunt",
    title: "Scottish Red Stag Hunt",
    category: "hunting",
    description: "Premium red stag hunt on private Highland estate with professional stalker and lodge.",
    longDescription:
      "A classic European hunting experience on managed Highland grounds. Includes estate stalker, rifle rental option, field dressing support, and full-board lodge accommodation. All permits arranged through licensed local partners.",
    destination: "Scotland — Highlands",
    duration: "5 days / 4 nights",
    difficulty: "Intermediate",
    species: "Red Stag",
    priceUsd: 4500,
    depositPercent: 40,
    maxGuests: 4,
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
    highlights: JSON.stringify([
      "Private estate access",
      "Licensed stalker & ghillie",
      "Trophy preparation support",
      "Luxury hunting lodge",
    ]),
    included: JSON.stringify([
      "Estate fees",
      "Stalker services",
      "Lodge full board",
      "Field dressing",
      "Permit assistance",
    ]),
    excluded: JSON.stringify([
      "Trophy fee (species dependent)",
      "Rifle import permit",
      "Taxidermy & shipping",
      "Gratuities",
    ]),
  },
  {
    slug: "wild-boar-balkans-hunt",
    title: "Balkan Wild Boar Hunt",
    category: "hunting",
    description: "Night and day wild boar hunting with local outfitter, mountain lodge, and translator.",
    longDescription:
      "Organized wild boar hunting in the Balkan mountains with experienced local outfitters. Suitable for international hunters seeking an affordable European driven and stalking combination hunt.",
    destination: "Serbia — Balkan Mountains",
    duration: "4 days / 3 nights",
    difficulty: "Intermediate",
    species: "Wild Boar",
    priceUsd: 3200,
    depositPercent: 40,
    maxGuests: 6,
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    highlights: JSON.stringify([
      "Day and night hunting stands",
      "Local outfitter & translator",
      "Mountain lodge accommodation",
      "Weapon rental available",
    ]),
    included: JSON.stringify([
      "Outfitter services",
      "Hunting license support",
      "Accommodation",
      "Meals",
      "Ground transport on site",
    ]),
    excluded: JSON.stringify(["Trophy fees", "Ammo", "Flights", "Export documents"]),
  },
  {
    slug: "arctic-bushcraft-program",
    title: "Arctic Bushcraft Skills Program",
    category: "survival",
    description: "Hands-on wilderness skills training: shelter, fire, navigation, and cold-weather survival.",
    longDescription:
      "A structured survival training program led by certified wilderness instructors. Learn essential bushcraft and cold-climate survival skills in a controlled, progressive environment. No gamification — pure professional outdoor training.",
    destination: "Finland — Lapland",
    duration: "5 days / 4 nights",
    difficulty: "Advanced",
    priceUsd: 1890,
    depositPercent: 30,
    maxGuests: 8,
    imageUrl: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&q=80",
    highlights: JSON.stringify([
      "Certified wilderness instructors",
      "Shelter building & fire craft",
      "Arctic navigation training",
      "Emergency first aid module",
    ]),
    included: JSON.stringify([
      "Instruction",
      "Base camp accommodation",
      "Meals",
      "Core survival kit rental",
      "Certificate of completion",
    ]),
    excluded: JSON.stringify([
      "Personal cold-weather clothing",
      "Flights",
      "Insurance",
      "Optional private gear",
    ]),
  },
  {
    slug: "jungle-survival-expedition",
    title: "Amazon Jungle Survival Expedition",
    category: "survival",
    description: "Intensive jungle survival course: water sourcing, shelter, navigation, and rescue protocols.",
    longDescription:
      "Train with veteran jungle guides in the Amazon basin. This program covers hydration, shelter construction, wildlife awareness, and emergency signaling. Designed for adventurers preparing for serious expeditions.",
    destination: "Peru — Amazon Basin",
    duration: "7 days / 6 nights",
    difficulty: "Advanced",
    priceUsd: 2450,
    depositPercent: 30,
    maxGuests: 6,
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80",
    highlights: JSON.stringify([
      "Veteran jungle guides",
      "Water purification training",
      "Emergency signaling drills",
      "River extraction protocols",
    ]),
    included: JSON.stringify([
      "Guide team",
      "Camping equipment",
      "Meals in field",
      "River transport",
      "Safety equipment",
    ]),
    excluded: JSON.stringify(["Flights to Iquitos", "Vaccinations", "Personal kit", "Insurance"]),
  },
];

async function main() {
  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }
  console.log(`Seeded ${packages.length} packages`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());