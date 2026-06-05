"use client";

import { CampaignPerformanceChart } from "@/components/charts/campaign-performance-chart";
import { MonthlyExpensesChart } from "@/components/charts/monthly-revenue-chart";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentCampaignsTable } from "@/components/tables/recent-campaigns-table";
import { useTranslations } from "@/providers/locale-provider";
import type { DashboardOverview } from "@/types";

interface DashboardContentProps {
  data: DashboardOverview;
}

export function DashboardContent({ data }: DashboardContentProps) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.welcomeTitle")}
        description={t("dashboard.welcomeDescription")}
      />

      <StatsCards stats={data.stats} />

      <div className="grid gap-6 xl:grid-cols-2">
        <CampaignPerformanceChart data={data.campaignPerformance} />
        <MonthlyExpensesChart data={data.monthlyExpenses} />
      </div>

      <RecentCampaignsTable campaigns={data.recentCampaigns} />
    </div>
  );
}
