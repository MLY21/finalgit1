"use client";

import { useEffect, useState } from "react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ClientBudgetChart } from "@/components/client/client-budget-chart";
import { ClientCampaignTable } from "@/components/client/client-campaign-table";
import { ClientPerformanceChart } from "@/components/client/client-performance-chart";
import { ClientStatsCards } from "@/components/client/client-stats-cards";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Database } from "lucide-react";

export default function UserOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs />
        <PageHeader title="Welcome back" description="Loading your dashboard..." />
        <div className="flex items-center justify-center h-96 text-zinc-400">Loading...</div>
      </div>
    );
  }

  const firstName = data?.clientName?.split(" ")[0] ?? "Client";

  if (!data || data.totalCampaigns === 0) {
    return (
      <div className="space-y-6">
        <Breadcrumbs />
        <PageHeader
          title={`Welcome back, ${firstName}`}
          description="Here is the latest performance overview for your advertising campaigns."
        />
        <DashboardCard className="flex flex-col items-center justify-center gap-4 py-20">
          <Database className="size-12 text-zinc-300 dark:text-zinc-600" />
          <div className="text-center">
            <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">No campaign data available yet.</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Your campaigns will appear here once they are imported.</p>
          </div>
        </DashboardCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here is the latest performance overview for your advertising campaigns."
      />

      <ClientStatsCards stats={data.stats} />

      <div className="grid gap-6 xl:grid-cols-2">
        <ClientPerformanceChart data={data.performance} title="Performance Overview" />
        <ClientBudgetChart data={data.budget} />
      </div>

      <ClientCampaignTable
        campaigns={data.campaigns}
        variant="recent"
        title="Recent Campaigns"
        description="Overview of your latest advertising campaigns"
      />
    </div>
  );
}
