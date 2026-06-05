import { formatLyd, formatNumber } from "@/lib/format";
import type { CampaignComparison } from "@/data/analytics";

interface CampaignComparisonProps {
  data: CampaignComparison;
}

export function CampaignComparison({ data }: CampaignComparisonProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Campaign 1 */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {data.campaign1.name}
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Views</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {formatNumber(data.campaign1.views)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Clicks</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {formatNumber(data.campaign1.clicks)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Leads</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {formatNumber(data.campaign1.leads)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Ad Spend</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {formatLyd(data.campaign1.adSpend)}
            </p>
          </div>
        </div>
      </div>

      {/* Campaign 2 */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {data.campaign2.name}
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Views</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {formatNumber(data.campaign2.views)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Clicks</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {formatNumber(data.campaign2.clicks)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Leads</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {formatNumber(data.campaign2.leads)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Ad Spend</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {formatLyd(data.campaign2.adSpend)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
