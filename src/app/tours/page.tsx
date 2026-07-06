import { CategoryPackagesPage } from "@/components/CategoryPackagesPage";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tours" };

export default function ToursPage() {
  return <CategoryPackagesPage category="tours" />;
}