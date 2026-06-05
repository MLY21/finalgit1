"use client";

import { useState } from "react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionNavigation } from "@/components/dashboard/analytics/section-navigation";
import { AnalyticsFilterBar } from "@/components/dashboard/analytics/analytics-filter-bar";
import { AnalyticsKPICard } from "@/components/dashboard/analytics/analytics-kpi-card";
import { AnalyticsCampaignPerformanceChart } from "@/components/dashboard/analytics/analytics-campaign-performance-chart";
import { MonthlyAdSpendChart } from "@/components/dashboard/analytics/monthly-ad-spend-chart";
import { PlatformPerformance } from "@/components/dashboard/analytics/platform-performance";
import { TopCampaignsTable } from "@/components/dashboard/analytics/top-campaigns-table";
import { InsightsSummary } from "@/components/dashboard/analytics/insights-summary";
import {
  analyticsOverview,
  performanceTrendData,
  monthlyAdSpendData,
  platformPerformance,
  topCampaigns,
  insightsSummary,
} from "@/data/analytics";

const navigationSections = [
  { id: "campaign-performance", label: "Campaign Performance" },
  { id: "monthly-ad-spend", label: "Monthly Ad Spend" },
  { id: "platform-performance", label: "Platform Performance" },
  { id: "top-campaigns", label: "Top Campaigns" },
  { id: "insights-summary", label: "Insights Summary" },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30days");
  const [client, setClient] = useState("all");
  const [platform, setPlatform] = useState("all");

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <PageHeader
        title="Analytics"
        description="Monitor campaign performance, ad spend, and marketing insights across all clients and campaigns."
      />

      {/* Section Navigation */}
      <SectionNavigation sections={navigationSections} />

      {/* Main Dashboard Card */}
      <DashboardCard className="overflow-hidden">
        {/* Filter Bar */}
        <AnalyticsFilterBar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          client={client}
          onClientChange={setClient}
          platform={platform}
          onPlatformChange={setPlatform}
        />

        {/* KPI Cards */}
        <div className="p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {analyticsOverview.map((kpi, index) => (
              <AnalyticsKPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
                isCurrency={kpi.title === "Total Ad Spend"}
              />
            ))}
          </div>
        </div>

        {/* Campaign Performance Chart */}
        <div id="campaign-performance" className="p-4 sm:p-5 pt-0">
          <AnalyticsCampaignPerformanceChart data={performanceTrendData} />
        </div>

        {/* Monthly Ad Spend Chart */}
        <div id="monthly-ad-spend" className="p-4 sm:p-5 pt-0">
          <MonthlyAdSpendChart data={monthlyAdSpendData} />
        </div>

        {/* Platform Performance */}
        <div id="platform-performance" className="p-4 sm:p-5 pt-0">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Platform Performance
          </h3>
          <PlatformPerformance data={platformPerformance} />
        </div>

        {/* Top Performing Campaigns */}
        <div id="top-campaigns" className="p-4 sm:p-5 pt-0">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Top Performing Campaigns
          </h3>
          <TopCampaignsTable campaigns={topCampaigns} />
        </div>

        {/* Insights Summary */}
        <div id="insights-summary" className="p-4 sm:p-5 pt-0">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Insights Summary
          </h3>
          <InsightsSummary insights={insightsSummary} />
        </div>
      </DashboardCard>
    </div>
  );
}
