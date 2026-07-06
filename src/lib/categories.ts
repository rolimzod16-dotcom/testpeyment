import type { PackageCategory } from "@/lib/utils";

export type CategoryMeta = {
  slug: PackageCategory;
  path: string;
  heroImage: string;
};

export const CATEGORY_META: Record<PackageCategory, CategoryMeta> = {
  tours: {
    slug: "tours",
    path: "/tours",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  },
  hunting: {
    slug: "hunting",
    path: "/hunting",
    heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80",
  },
  survival: {
    slug: "survival",
    path: "/survival",
    heroImage: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1600&q=80",
  },
};

export const VALID_CATEGORIES = Object.keys(CATEGORY_META) as PackageCategory[];

export function isPackageCategory(value: string): value is PackageCategory {
  return VALID_CATEGORIES.includes(value as PackageCategory);
}

export function getCategoryMeta(category: string): CategoryMeta | null {
  if (!isPackageCategory(category)) return null;
  return CATEGORY_META[category];
}