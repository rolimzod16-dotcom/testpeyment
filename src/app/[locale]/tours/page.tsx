import { getTranslations } from "next-intl/server";
import { CategoryPackagesPage } from "@/components/CategoryPackagesPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories.tours" });
  return { title: t("pageTitle") };
}

export default function ToursPage() {
  return <CategoryPackagesPage category="tours" />;
}