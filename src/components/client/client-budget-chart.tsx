"use client";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { Progress } from "@/components/ui/progress";
import { formatLyd } from "@/lib/format";
import type { BudgetUsage } from "@/types/client";

interface ClientBudgetChartProps {
  data: any;
}

export function ClientBudgetChart({ data }: ClientBudgetChartProps) {
  const totalBudget = data.totalBudget ?? 0;
  const totalSpent = data.totalSpent ?? data.totalSpend ?? 0;
  const remainingBudget = data.remainingBudget ?? data.remainingBudget ?? (totalBudget - totalSpent);
  const spentPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const rows = [
    {
      label: "Total Budget",
      value: totalBudget,
      valueClass: "text-zinc-900 dark:text-zinc-100",
    },
    {
      label: "Total Spent",
      value: totalSpent,
      valueClass: "text-zinc-900 dark:text-zinc-100",
    },
    {
      label: "Remaining Budget",
      value: remainingBudget,
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <DashboardCard className="p-5 sm:p-6">
      <SectionHeader
        title="Budget Usage"
        description="Spending across all your campaigns"
        className="mb-6"
      />

      <div className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-400">
              {Math.round(spentPercent)}% used
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              {formatLyd(totalSpent)} / {formatLyd(totalBudget)}
            </span>
          </div>
          <Progress value={spentPercent} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {row.label}
              </p>
              <p className={`mt-1 text-lg font-semibold tracking-tight ${row.valueClass}`}>
                {formatLyd(row.value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
