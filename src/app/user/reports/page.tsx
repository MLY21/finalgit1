"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ClientCampaignTable } from "@/components/client/client-campaign-table";
import { ClientPerformanceChart } from "@/components/client/client-performance-chart";
import {
  ClientReportsFilter,
  type ReportsFilterValue,
} from "@/components/client/client-reports-filter";
import { ChartCard } from "@/components/charts/chart-card";
import { ChartContainer } from "@/components/charts/chart-container";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionHeader } from "@/components/dashboard/section-header";
import {
  getChartAxisTick,
  getChartLegendProps,
  getChartTooltipProps,
} from "@/lib/chart-config";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { clientCampaigns } from "@/data/client-dashboard";
import { formatLyd, formatNumber } from "@/lib/format";
import { platformLabels } from "@/lib/platform-labels";
import type { PerformancePoint } from "@/types/client";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <DashboardCard className="p-4">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
    </DashboardCard>
  );
}

export default function UserReportsPage() {
  const [filters, setFilters] = useState<ReportsFilterValue>({
    dateRange: "90d",
    platform: "all",
    status: "all",
  });

  const theme = useChartTheme();
  const tooltipProps = getChartTooltipProps(theme);
  const axisTick = getChartAxisTick(theme);
  const legendProps = getChartLegendProps();

  const filtered = useMemo(
    () =>
      clientCampaigns.filter(
        (c) =>
          (filters.platform === "all" || c.platform === filters.platform) &&
          (filters.status === "all" || c.status === filters.status)
      ),
    [filters.platform, filters.status]
  );

  const summary = useMemo(() => {
    const totalViews = filtered.reduce((s, c) => s + c.views, 0);
    const totalClicks = filtered.reduce((s, c) => s + c.clicks, 0);
    const totalLeads = filtered.reduce((s, c) => s + c.leads, 0);
    const totalSpent = filtered.reduce((s, c) => s + c.spent, 0);
    const totalRevenue = filtered.reduce((s, c) => s + c.revenue, 0);
    return {
      totalViews,
      totalClicks,
      totalLeads,
      totalSpent,
      totalRevenue,
      netProfit: totalRevenue - totalSpent,
    };
  }, [filtered]);

  const performance = useMemo<PerformancePoint[]>(
    () =>
      MONTHS.map((name, index) => {
        let views = 0;
        let clicks = 0;
        let leads = 0;
        for (const c of filtered) {
          const point = c.performanceSeries[index];
          if (point) {
            views += point.views;
            clicks += point.clicks;
            leads += point.leads;
          }
        }
        return { name, views, clicks, leads };
      }),
    [filtered]
  );

  const revenueVsExpenses = useMemo(
    () =>
      MONTHS.map((name, index) => ({
        name,
        revenue: Math.round((summary.totalRevenue / 7) * (0.7 + index * 0.09)),
        expenses: Math.round((summary.totalSpent / 7) * (0.8 + index * 0.06)),
      })),
    [summary]
  );

  const leadsByPlatform = useMemo(() => {
    const byPlatform: Record<string, number> = {};
    for (const c of filtered) {
      byPlatform[c.platform] = (byPlatform[c.platform] ?? 0) + c.leads;
    }
    return Object.entries(byPlatform).map(([platform, leads]) => ({
      name: platformLabels[platform as keyof typeof platformLabels] ?? platform,
      leads,
    }));
  }, [filtered]);

  const bestPerforming = useMemo(
    () => [...filtered].sort((a, b) => b.performance - a.performance).slice(0, 5),
    [filtered]
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <PageHeader
        title="Reports"
        description="Analyze performance, revenue, and leads across your campaigns."
      />

      <ClientReportsFilter value={filters} onChange={setFilters} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <SummaryCard label="Total Views" value={formatNumber(summary.totalViews, { compact: true })} />
        <SummaryCard label="Total Clicks" value={formatNumber(summary.totalClicks, { compact: true })} />
        <SummaryCard label="Total Leads" value={formatNumber(summary.totalLeads, { compact: true })} />
        <SummaryCard label="Total Spent" value={formatLyd(summary.totalSpent, { compact: true })} />
        <SummaryCard label="Total Revenue" value={formatLyd(summary.totalRevenue, { compact: true })} />
        <SummaryCard label="Net Profit" value={formatLyd(summary.netProfit, { compact: true })} />
      </div>

      <ClientPerformanceChart
        data={performance}
        title="Campaign Performance"
        description="Views, clicks, and leads over time"
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Revenue vs Expenses"
          description="Monthly revenue compared to spend"
        >
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueVsExpenses} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
                <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatLyd(Number(value), { compact: true })}
                />
                <Tooltip
                  {...tooltipProps}
                  formatter={(value, name) => [formatLyd(Number(value ?? 0)), String(name)]}
                />
                <Legend {...legendProps} />
                <Bar dataKey="revenue" name="Revenue" fill={theme.line.conversions} radius={[6, 6, 0, 0]} maxBarSize={28} />
                <Bar dataKey="expenses" name="Expenses" fill={theme.line.clicks} radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard
          title="Leads by Platform"
          description="Total leads generated per platform"
        >
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsByPlatform} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
                <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipProps} />
                <Bar dataKey="leads" name="Leads" fill={theme.barFill} radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
      </div>

      <div className="space-y-3">
        <SectionHeader title="Best Performing Campaigns" />
        {bestPerforming.length > 0 ? (
          <ClientCampaignTable campaigns={bestPerforming} variant="recent" />
        ) : (
          <DashboardCard className="flex min-h-[160px] items-center justify-center p-8">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              No campaigns match your filters.
            </p>
          </DashboardCard>
        )}
      </div>
    </div>
  );
}
