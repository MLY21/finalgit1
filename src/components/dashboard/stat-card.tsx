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
}

export function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  comparisonLabel,
}: StatCardProps) {
  const isPositive = trend === "up";

  return (
    <DashboardCard hover className="group p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {value}
          </p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-zinc-900 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900">
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
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {comparisonLabel}
        </span>
      </div>
    </DashboardCard>
  );
}

