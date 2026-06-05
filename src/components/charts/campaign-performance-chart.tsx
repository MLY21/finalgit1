"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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
import { useTranslations } from "@/providers/locale-provider";
import type { ChartDataPoint } from "@/types";

interface CampaignPerformanceChartProps {
  data: ChartDataPoint[];
}

export function CampaignPerformanceChart({
  data,
}: CampaignPerformanceChartProps) {
  const t = useTranslations();
  const theme = useChartTheme();
  const tooltipProps = getChartTooltipProps(theme);
  const axisTick = getChartAxisTick(theme);
  const legendProps = getChartLegendProps();

  return (
    <ChartCard
      title={t("charts.campaignPerformance.title")}
      description={t("charts.campaignPerformance.description")}
    >
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
            <Line
              type="monotone"
              dataKey="impressions"
              name={t("charts.campaignPerformance.impressions")}
              stroke={theme.line.impressions}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="clicks"
              name={t("charts.campaignPerformance.clicks")}
              stroke={theme.line.clicks}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="conversions"
              name={t("charts.campaignPerformance.conversions")}
              stroke={theme.line.conversions}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ChartCard>
  );
}
