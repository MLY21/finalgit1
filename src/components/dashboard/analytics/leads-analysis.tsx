"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/charts/chart-card";
import { ChartContainer } from "@/components/charts/chart-container";
import {
  getChartAxisTick,
  getChartTooltipProps,
} from "@/lib/chart-config";
import { formatNumber } from "@/lib/format";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { cn } from "@/lib/utils";
import type { LeadAnalysis } from "@/data/analytics";

interface LeadsAnalysisProps {
  data: LeadAnalysis;
}

export function LeadsAnalysis({ data }: LeadsAnalysisProps) {
  const theme = useChartTheme();
  const tooltipProps = getChartTooltipProps(theme);
  const axisTick = getChartAxisTick(theme);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Total Leads Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Total Leads
        </h3>
        <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {formatNumber(data.totalLeads)}
        </p>
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={cn(
              "text-xs font-semibold",
              data.leadGrowth > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            )}
          >
            {data.leadGrowth > 0 ? "+" : ""}
            {data.leadGrowth}%
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            growth
          </span>
        </div>
      </div>

      {/* Lead Distribution by Platform */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Lead Distribution by Platform
        </h3>
        <div className="space-y-3">
          {data.leadsByPlatform.map((item) => (
            <div key={item.platform}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {item.platform}
                </span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.percentage}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Trend Chart */}
      <div className="lg:col-span-2">
        <ChartCard title="Lead Trend Over Time" description="">
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.leadTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.grid}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatNumber(Number(value))}
                />
                <Tooltip {...tooltipProps} formatter={(value) => formatNumber(Number(value ?? 0))} />
                <Bar
                  dataKey="leads"
                  fill={theme.line.conversions}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                  name="Leads"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  );
}
