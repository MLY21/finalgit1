import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  comparisonLabel: string;
  accent?: "green" | "blue" | "purple" | "orange";
}

const accentColors = {
  green: {
    bg: "bg-emerald-50 dark:bg-emerald-950",
    text: "text-emerald-700 dark:text-emerald-400",
    hoverBg: "group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-400 dark:group-hover:text-emerald-950",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950",
    text: "text-blue-700 dark:text-blue-400",
    hoverBg: "group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-400 dark:group-hover:text-blue-950",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950",
    text: "text-purple-700 dark:text-purple-400",
    hoverBg: "group-hover:bg-purple-600 group-hover:text-white dark:group-hover:bg-purple-400 dark:group-hover:text-purple-950",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950",
    text: "text-orange-700 dark:text-orange-400",
    hoverBg: "group-hover:bg-orange-600 group-hover:text-white dark:group-hover:bg-orange-400 dark:group-hover:text-orange-950",
  },
};

export function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  comparisonLabel,
  accent = "blue",
}: StatCardProps) {
  const isPositive = trend === "up";
  const accentStyle = accentColors[accent];

  return (
    <DashboardCard hover className="group p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div className={cn(
          "flex size-10 items-center justify-center rounded-xl transition-colors",
          accentStyle.bg,
          accentStyle.text,
          accentStyle.hoverBg
        )}>
          <Icon className="size-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5">
        {isPositive ? (
          <ArrowUpRight className="size-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <ArrowDownRight className="size-4 text-rose-600 dark:text-rose-400" />
        )}
        <span
          className={cn(
            "text-sm font-medium",
            isPositive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          )}
        >
          {change}
        </span>
        <span className="text-sm text-muted-foreground">
          {comparisonLabel}
        </span>
      </div>
    </DashboardCard>
  );
}

