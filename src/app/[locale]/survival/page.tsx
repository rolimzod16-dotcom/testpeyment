import { getTranslations } from "next-intl/server";
import { CategoryPackagesPage } from "@/components/CategoryPackagesPage";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories.survival" });
  return { title: t("pageTitle") };
}

export default async function SurvivalPage({ searchParams }: Props) {
  const { sort } = await searchParams;
  return <CategoryPackagesPage category="survival" sort={sort} />;
}
