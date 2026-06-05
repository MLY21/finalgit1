import { formatLyd, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PlatformPerformance } from "@/data/analytics";

interface PlatformPerformanceProps {
  data: PlatformPerformance[];
}

export function PlatformPerformance({ data }: PlatformPerformanceProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {data.map((platform) => (
        <div
          key={platform.platform}
          className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {platform.platform}
          </h3>
          
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Views</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {formatNumber(platform.views)}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Clicks</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {formatNumber(platform.clicks)}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Leads</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {formatNumber(platform.leads)}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Ad Spend</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {formatLyd(platform.adSpend)}
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Lead Growth</span>
              <span
                className={cn(
                  "text-xs font-semibold",
                  platform.leadGrowth > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                )}
              >
                {platform.leadGrowth > 0 ? "+" : ""}
                {platform.leadGrowth}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
