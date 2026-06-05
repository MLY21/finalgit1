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
import type { PerformancePoint } from "@/types/client";

interface ClientPerformanceChartProps {
  data: PerformancePoint[];
  title?: string;
  description?: string;
}

export function ClientPerformanceChart({
  data,
  title = "Campaign Performance",
  description = "Views, clicks, and leads over time",
}: ClientPerformanceChartProps) {
  const theme = useChartTheme();
  const tooltipProps = getChartTooltipProps(theme);
  const axisTick = getChartAxisTick(theme);
  const legendProps = getChartLegendProps();

  return (
    <ChartCard title={title} description={description}>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
            <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipProps} />
            <Legend {...legendProps} />
            <Line
              type="monotone"
              dataKey="views"
              name="Views"
              stroke={theme.line.impressions}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="clicks"
              name="Clicks"
              stroke={theme.line.clicks}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="leads"
              name="Leads"
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
