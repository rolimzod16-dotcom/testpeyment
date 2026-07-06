import { CategoryPackagesPage } from "@/components/CategoryPackagesPage";

export const dynamic = "force-dynamic";

export const metadata = { title: "Hunting" };

export default function HuntingPage() {
  return <CategoryPackagesPage category="hunting" />;
}