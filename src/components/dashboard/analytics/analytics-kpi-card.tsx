import { formatLyd, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AnalyticsKPICardProps {
  title: string;
  value: number;
  change: number;
  trend: "up" | "down";
  isCurrency?: boolean;
}

export function AnalyticsKPICard({
  title,
  value,
  change,
  trend,
  isCurrency = false,
}: AnalyticsKPICardProps) {
  const displayValue = isCurrency ? formatLyd(value) : formatNumber(value);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
      <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {displayValue}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className={cn(
            "text-xs font-semibold",
            trend === "up"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          )}
        >
          {trend === "up" ? "+" : ""}
          {change}%
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          vs last month
        </span>
      </div>
    </div>
  );
}
