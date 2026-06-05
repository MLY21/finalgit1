import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getDashboardOverview } from "@/services/dashboard.service";

export default async function DashboardPage() {
  const data = await getDashboardOverview();

  return <DashboardContent data={data} />;
}
