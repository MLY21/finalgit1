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
import { formatCompactCurrency } from "@/lib/format";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { useLocale, useTranslations } from "@/providers/locale-provider";
import type { ChartDataPoint } from "@/types";

interface MonthlyExpensesChartProps {
  data: ChartDataPoint[];
}

export function MonthlyExpensesChart({ data }: MonthlyExpensesChartProps) {
  const t = useTranslations();
  const { locale } = useLocale();
  const theme = useChartTheme();
  const tooltipProps = getChartTooltipProps(theme);
  const axisTick = getChartAxisTick(theme);
  const expensesLabel = t("charts.monthlyExpenses.expenses");

  return (
    <ChartCard
      title={t("charts.monthlyExpenses.title")}
      description={t("charts.monthlyExpenses.description")}
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
                expensesLabel,
              ]}
            />
            <Bar
              dataKey="expenses"
              fill={theme.barFill}
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ChartCard>
  );
}
