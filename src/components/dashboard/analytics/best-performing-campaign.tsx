import { formatLyd, formatNumber } from "@/lib/format";
import type { CampaignInsight } from "@/data/analytics";

interface BestPerformingCampaignProps {
  campaign: CampaignInsight;
}

export function BestPerformingCampaign({ campaign }: BestPerformingCampaignProps) {
  return (
    <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30">
          <svg className="size-4 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Best Performing Campaign
        </h3>
      </div>

      <div className="mb-4">
        <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {campaign.name}
        </h4>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {campaign.client} • {campaign.platform}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Views</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {formatNumber(campaign.views)}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Clicks</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {formatNumber(campaign.clicks)}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Leads</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {formatNumber(campaign.leads)}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Ad Spend</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {formatLyd(campaign.adSpend)}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Conversion Rate</span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {campaign.conversionRate}%
          </span>
        </div>
      </div>
    </div>
  );
}
