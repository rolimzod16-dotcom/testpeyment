import { getTranslations } from "next-intl/server";
import { CategoryPackagesPage } from "@/components/CategoryPackagesPage";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories.tours" });
  return { title: t("pageTitle") };
}

export default async function ToursPage({ searchParams }: Props) {
  const { sort } = await searchParams;
  return <CategoryPackagesPage category="tours" sort={sort} />;
}
