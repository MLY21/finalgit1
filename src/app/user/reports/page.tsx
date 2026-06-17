"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Database } from "lucide-react";
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
  getChartTooltipProps,
} from "@/lib/chart-config";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { formatLyd, formatNumber } from "@/lib/format";
import { platformLabels } from "@/lib/platform-labels";

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
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/campaigns")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCampaigns(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const theme = useChartTheme();
  const tooltipProps = getChartTooltipProps(theme);
  const axisTick = getChartAxisTick(theme);

  const filtered = useMemo(
    () =>
      campaigns.filter(
        (c: any) =>
          (filters.platform === "all" || c.platform === filters.platform) &&
          (filters.status === "all" || c.status === filters.status)
      ),
    [filters.platform, filters.status, campaigns]
  );

  const summary = useMemo(() => {
    const totalViews = filtered.reduce((s, c) => s + c.views, 0);
    const totalClicks = filtered.reduce((s, c) => s + c.clicks, 0);
    const totalMessages = filtered.reduce((s, c) => s + c.messages, 0);
    const totalSpent = filtered.reduce((s, c) => s + c.spend, 0);
    return { totalViews, totalClicks, totalMessages, totalSpent };
  }, [filtered]);

  const performance = useMemo(
    () => {
      if (filtered.length === 0) return [];
      const monthly = new Map<string, { views: number; clicks: number; leads: number }>();
      // Since we don't have per-month breakdown in this simplified API, aggregate by campaign
      for (const c of filtered) {
        const key = c.startDate?.slice(0, 7) ?? "Unknown";
        const existing = monthly.get(key) ?? { views: 0, clicks: 0, leads: 0 };
        existing.views += c.views ?? 0;
        existing.clicks += c.clicks ?? 0;
        existing.leads += c.messages ?? 0;
        monthly.set(key, existing);
      }
      return Array.from(monthly.entries()).map(([name, data]) => ({ name, ...data }));
    },
    [filtered]
  );

  const messagesByPlatform = useMemo(() => {
    const byPlatform: Record<string, number> = {};
    for (const c of filtered) {
      byPlatform[c.platform] = (byPlatform[c.platform] ?? 0) + (c.messages ?? 0);
    }
    return Object.entries(byPlatform).map(([platform, messages]) => ({
      name: platformLabels[(platform ?? "").toUpperCase() as keyof typeof platformLabels] ?? platform,
      messages,
    }));
  }, [filtered]);

  const bestPerforming = useMemo(
    () => [...filtered].sort((a, b) => (b.clicks / Math.max(b.views, 1)) - (a.clicks / Math.max(a.views, 1))).slice(0, 5),
    [filtered]
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <PageHeader
        title="Reports"
        description="Analyze performance, spend, and leads across your campaigns."
      />

      <ClientReportsFilter value={filters} onChange={setFilters} />

      {loading ? (
        <DashboardCard className="flex min-h-[200px] items-center justify-center p-8">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Loading reports...</p>
        </DashboardCard>
      ) : campaigns.length === 0 ? (
        <DashboardCard className="flex flex-col items-center justify-center gap-4 py-20">
          <Database className="size-12 text-zinc-300 dark:text-zinc-600" />
          <div className="text-center">
            <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">No campaign data available yet.</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Your campaigns will appear here once they are imported.</p>
          </div>
        </DashboardCard>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <SummaryCard label="Total Views" value={formatNumber(summary.totalViews, { compact: true })} />
            <SummaryCard label="Total Clicks" value={formatNumber(summary.totalClicks, { compact: true })} />
            <SummaryCard label="Total Messages" value={formatNumber(summary.totalMessages, { compact: true })} />
            <SummaryCard label="Total Spent" value={formatLyd(summary.totalSpent, { compact: true })} />
          </div>

          <ClientPerformanceChart
            data={performance}
            title="Campaign Performance"
            description="Views, clicks, and messages over time"
          />

          <ChartCard
            title="Messages by Platform"
            description="Total messages started per platform"
          >
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={messagesByPlatform} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
                  <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipProps} />
                  <Bar dataKey="messages" name="Messages" fill={theme.barFill} radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>

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
        </>
      )}
    </div>
  );
}
