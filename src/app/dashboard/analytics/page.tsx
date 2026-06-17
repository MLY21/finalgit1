"use client";

import { useEffect, useState } from "react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionNavigation } from "@/components/dashboard/analytics/section-navigation";
import { AnalyticsFilterBar } from "@/components/dashboard/analytics/analytics-filter-bar";
import { AnalyticsKPICard } from "@/components/dashboard/analytics/analytics-kpi-card";
import { AnalyticsCampaignPerformanceChart } from "@/components/dashboard/analytics/analytics-campaign-performance-chart";
import { MonthlyAdSpendChart } from "@/components/dashboard/analytics/monthly-ad-spend-chart";
import { PlatformPerformance } from "@/components/dashboard/analytics/platform-performance";
import { TopCampaignsTable } from "@/components/dashboard/analytics/top-campaigns-table";
import { Database } from "lucide-react";

const navigationSections = [
  { id: "kpi-cards", label: "Overview" },
  { id: "campaign-performance", label: "Campaign Performance" },
  { id: "platform-performance", label: "Platform Performance" },
  { id: "top-campaigns", label: "Top Campaigns" },
];

interface OverviewData {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpend: number;
  totalReach: number;
  totalImpressions: number;
  totalClicks: number;
  avgCtr: number;
  avgCpc: number;
  totalEngagements: number;
  totalMessages: number;
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30days");
  const [client, setClient] = useState("all");
  const [platform, setPlatform] = useState("all");

  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [platformData, setPlatformData] = useState<any[]>([]);
  const [topCampaignsData, setTopCampaignsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/analytics/overview").then((r) => r.json()),
      fetch("/api/analytics/performance-trend").then((r) => r.json()),
      fetch("/api/analytics/platform-performance").then((r) => r.json()),
      fetch("/api/analytics/campaigns?sortBy=spend&limit=10").then((r) => r.json()),
    ])
      .then(([overviewRes, trendRes, platformRes, campaignsRes]) => {
        if (overviewRes.success) setOverview(overviewRes.data);
        if (trendRes.success) setTrendData(trendRes.data);
        if (platformRes.success) setPlatformData(platformRes.data);
        if (campaignsRes.success) setTopCampaignsData(campaignsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const hasData = overview && overview.totalCampaigns > 0;

  if (loading) {
    return (
      <div className="space-y-5">
        <PageHeader title="Analytics" description="Monitor campaign performance across all clients and campaigns." />
        <div className="flex items-center justify-center h-96 text-zinc-400">Loading analytics...</div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="space-y-5">
        <PageHeader title="Analytics" description="Monitor campaign performance across all clients and campaigns." />
        <DashboardCard className="flex flex-col items-center justify-center gap-4 py-20">
          <Database className="size-12 text-zinc-300 dark:text-zinc-600" />
          <div className="text-center">
            <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">No campaign analytics available yet.</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Import campaigns from Facebook to view analytics.</p>
          </div>
        </DashboardCard>
      </div>
    );
  }

  const kpiCards = overview ? [
    { title: "Total Campaigns", value: overview.totalCampaigns, change: 0, trend: "up" as const, isCurrency: false },
    { title: "Active Campaigns", value: overview.activeCampaigns, change: 0, trend: "up" as const, isCurrency: false },
    { title: "Total Spend", value: overview.totalSpend, change: 0, trend: "up" as const, isCurrency: true },
    { title: "Total Reach", value: overview.totalReach, change: 0, trend: "up" as const, isCurrency: false },
    { title: "Total Impressions", value: overview.totalImpressions, change: 0, trend: "up" as const, isCurrency: false },
    { title: "Total Clicks", value: overview.totalClicks, change: 0, trend: "up" as const, isCurrency: false },
    { title: "Avg CTR", value: overview.avgCtr, change: 0, trend: "up" as const, isCurrency: false },
    { title: "Avg CPC", value: overview.avgCpc, change: 0, trend: "up" as const, isCurrency: true },
  ] : [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Analytics"
        description="Monitor campaign performance, ad spend, and marketing insights across all clients and campaigns."
      />

      <SectionNavigation sections={navigationSections} />

      <DashboardCard className="overflow-hidden">
        <AnalyticsFilterBar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          client={client}
          onClientChange={setClient}
          platform={platform}
          onPlatformChange={setPlatform}
        />

        {/* KPI Cards */}
        <div id="kpi-cards" className="p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((kpi, index) => (
              <AnalyticsKPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
                isCurrency={kpi.isCurrency}
              />
            ))}
          </div>
        </div>

        {/* Campaign Performance Chart */}
        <div id="campaign-performance" className="p-4 sm:p-5 pt-0">
          <AnalyticsCampaignPerformanceChart data={trendData.map((d: any) => ({ name: d.name, views: d.impressions, clicks: d.clicks, leads: d.engagements }))} />
        </div>

        {/* Platform Performance */}
        <div id="platform-performance" className="p-4 sm:p-5 pt-0">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Platform Performance
          </h3>
          <PlatformPerformance data={platformData.map((p: any) => ({ platform: p.platform, views: p.impressions, clicks: p.clicks, leads: p.messagesStarted, adSpend: p.spend, leadGrowth: 0, clickThroughRate: p.clickThroughRate }))} />
        </div>

        {/* Top Performing Campaigns */}
        <div id="top-campaigns" className="p-4 sm:p-5 pt-0">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Top Performing Campaigns
          </h3>
          <TopCampaignsTable campaigns={topCampaignsData.map((c: any) => ({ id: c.id, name: c.name, client: c.clientName ?? "Unlinked", platform: c.platform, leads: c.messagesStarted, clicks: c.clicks, adSpend: c.spend, status: c.status.toLowerCase() }))} />
        </div>
      </DashboardCard>
    </div>
  );
}
