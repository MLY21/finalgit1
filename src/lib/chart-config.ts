import type { ChartTheme } from "@/hooks/use-chart-theme";

export function getChartTooltipProps(theme: ChartTheme) {
  return {
    contentStyle: {
      backgroundColor: theme.tooltipBg,
      borderColor: theme.tooltipBorder,
      borderRadius: "12px",
      fontSize: "12px",
    },
    labelStyle: { color: theme.tooltipLabel },
  };
}

export function getChartLegendProps() {
  return {
    wrapperStyle: { fontSize: "12px", paddingTop: "16px" },
  };
}

export function getChartAxisTick(theme: ChartTheme) {
  return { fill: theme.text, fontSize: 12 };
}
