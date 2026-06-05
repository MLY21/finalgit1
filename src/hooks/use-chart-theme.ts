"use client";

import { useTheme } from "next-themes";

export interface ChartTheme {
  grid: string;
  text: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipLabel: string;
  barFill: string;
  line: {
    impressions: string;
    clicks: string;
    conversions: string;
  };
}

const lightTheme: ChartTheme = {
  grid: "#e4e4e7",
  text: "#71717a",
  tooltipBg: "#ffffff",
  tooltipBorder: "#e4e4e7",
  tooltipLabel: "#18181b",
  barFill: "#18181b",
  line: {
    impressions: "#3b82f6",
    clicks: "#8b5cf6",
    conversions: "#10b981",
  },
};

const darkTheme: ChartTheme = {
  grid: "#3f3f46",
  text: "#a1a1aa",
  tooltipBg: "#18181b",
  tooltipBorder: "#3f3f46",
  tooltipLabel: "#fafafa",
  barFill: "#fafafa",
  line: {
    impressions: "#3b82f6",
    clicks: "#8b5cf6",
    conversions: "#10b981",
  },
};

export function useChartTheme(): ChartTheme {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark" ? darkTheme : lightTheme;
}
