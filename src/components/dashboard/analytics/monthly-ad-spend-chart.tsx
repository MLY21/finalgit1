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
import { formatCompactCurrency } from "@/lib/format";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { useLocale } from "@/providers/locale-provider";
import type { MonthlyAdSpendData } from "@/data/analytics";

interface MonthlyAdSpendChartProps {
  data: MonthlyAdSpendData[];
}

export function MonthlyAdSpendChart({ data }: MonthlyAdSpendChartProps) {
  const { locale } = useLocale();
  const theme = useChartTheme();
  const tooltipProps = getChartTooltipProps(theme);
  const axisTick = getChartAxisTick(theme);
  const legendProps = getChartLegendProps();

  return (
    <ChartCard
      title="Monthly Ad Spend"
      description="Advertising spend by platform over time"
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
            <YAxis
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                formatCompactCurrency(Number(value), locale)
              }
            />
            <Tooltip
              {...tooltipProps}
              formatter={(value) => [
                formatCompactCurrency(Number(value ?? 0), locale),
              ]}
            />
            <Legend {...legendProps} />
            <Bar
              dataKey="metaAds"
              fill={theme.line.impressions}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              name="Meta Ads"
            />
            <Bar
              dataKey="googleAds"
              fill={theme.line.clicks}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              name="Google Ads"
            />
            <Bar
              dataKey="tiktokAds"
              fill={theme.line.conversions}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              name="TikTok Ads"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ChartCard>
  );
}
