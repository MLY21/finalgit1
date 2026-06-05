import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ClientBudgetChart } from "@/components/client/client-budget-chart";
import { ClientCampaignTable } from "@/components/client/client-campaign-table";
import { ClientPerformanceChart } from "@/components/client/client-performance-chart";
import { ClientStatsCards } from "@/components/client/client-stats-cards";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  budgetUsageData,
  campaignPerformanceData,
  clientCampaigns,
  clientInfo,
  clientStats,
} from "@/data/client-dashboard";

export default function UserOverviewPage() {
  const firstName = clientInfo.name.split(" ")[0];
  const recentCampaigns = clientCampaigns.slice(0, 5);

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here is the latest performance overview for your advertising campaigns."
      />

      <ClientStatsCards stats={clientStats} />

      <div className="grid gap-6 xl:grid-cols-2">
        <ClientPerformanceChart data={campaignPerformanceData} />
        <ClientBudgetChart data={budgetUsageData} />
      </div>

      <ClientCampaignTable
        campaigns={recentCampaigns}
        variant="recent"
        title="Recent Campaigns"
        description="Overview of your latest advertising campaigns"
      />
    </div>
  );
}
