import { cn } from "@/lib/utils";
import type { InsightSummary } from "@/data/analytics";

interface InsightsSummaryProps {
  insights: InsightSummary[];
}

export function InsightsSummary({ insights }: InsightsSummaryProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {insights.map((insight, index) => (
        <div
          key={index}
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 size-2 rounded-full shrink-0",
                insight.type === "success" && "bg-emerald-500",
                insight.type === "info" && "bg-blue-500",
                insight.type === "warning" && "bg-amber-500"
              )}
            />
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {insight.title}
              </h4>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                {insight.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
