import { CategoryPackagesPage } from "@/components/CategoryPackagesPage";

export const dynamic = "force-dynamic";

export const metadata = { title: "Survival Challenge" };

export default function SurvivalPage() {
  return <CategoryPackagesPage category="survival" />;
}