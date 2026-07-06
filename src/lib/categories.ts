import type { PackageCategory } from "@/lib/utils";

export type CategoryConfig = {
  slug: PackageCategory;
  path: string;
  navLabel: string;
  pageTitle: string;
  overline: string;
  description: string;
  heroImage: string;
  emptyTitle: string;
  emptyDescription: string;
};

export const CATEGORIES: Record<PackageCategory, CategoryConfig> = {
  tours: {
    slug: "tours",
    path: "/tours",
    navLabel: "Tours",
    pageTitle: "International Tours",
    overline: "Tour Packages",
    description:
      "Our core offering — curated international tour packages for nature, culture, and adventure.",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
    emptyTitle: "No tour packages yet",
    emptyDescription: "New tour packages will appear here soon.",
  },
  hunting: {
    slug: "hunting",
    path: "/hunting",
    navLabel: "Hunting",
    pageTitle: "Hunting Packages",
    overline: "Signature Experience",
    description:
      "Licensed hunting expeditions with professional outfitters, permits, and lodge stays.",
    heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80",
    emptyTitle: "No hunting packages yet",
    emptyDescription: "New hunting expeditions will appear here soon.",
  },
  survival: {
    slug: "survival",
    path: "/survival",
    navLabel: "Survival Challenge",
    pageTitle: "Survival Challenge",
    overline: "Signature Experience",
    description:
      "Professional wilderness survival programs — bushcraft, navigation, and emergency protocols.",
    heroImage: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1600&q=80",
    emptyTitle: "No survival programs yet",
    emptyDescription: "New survival challenges will appear here soon.",
  },
};

export const VALID_CATEGORIES = Object.keys(CATEGORIES) as PackageCategory[];

export function isPackageCategory(value: string): value is PackageCategory {
  return VALID_CATEGORIES.includes(value as PackageCategory);
}

export function getCategoryConfig(category: string): CategoryConfig | null {
  if (!isPackageCategory(category)) return null;
  return CATEGORIES[category];
}