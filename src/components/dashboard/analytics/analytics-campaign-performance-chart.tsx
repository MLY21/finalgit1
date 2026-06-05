"use client";

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

import { ChartCard } from "@/components/charts/chart-card";
import { ChartContainer } from "@/components/charts/chart-container";
import {
  getChartAxisTick,
  getChartLegendProps,
  getChartTooltipProps,
} from "@/lib/chart-config";
import { useChartTheme } from "@/hooks/use-chart-theme";
import type { PerformanceTrendData } from "@/data/analytics";

interface AnalyticsCampaignPerformanceChartProps {
  data: PerformanceTrendData[];
}

export function AnalyticsCampaignPerformanceChart({
  data,
}: AnalyticsCampaignPerformanceChartProps) {
  const theme = useChartTheme();
  const tooltipProps = getChartTooltipProps(theme);
  const axisTick = getChartAxisTick(theme);
  const legendProps = getChartLegendProps();

  return (
    <ChartCard
      title="Campaign Performance"
      description="Views, clicks, and leads over time"
    >
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.grid}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={axisTick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipProps} />
            <Legend {...legendProps} />
            <Bar
              dataKey="views"
              fill={theme.line.impressions}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              name="Views"
            />
            <Bar
              dataKey="clicks"
              fill={theme.line.clicks}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              name="Clicks"
            />
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
  );
}
