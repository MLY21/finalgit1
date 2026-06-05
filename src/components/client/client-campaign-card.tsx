import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ClientStatusBadge } from "@/components/client/client-status-badge";
import { PerformanceBar } from "@/components/dashboard/performance-bar";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, formatLyd } from "@/lib/format";
import { platformLabels } from "@/lib/platform-labels";
import { cn } from "@/lib/utils";
import type { ClientCampaign } from "@/types/client";

interface ClientCampaignCardProps {
  campaign: ClientCampaign;
  variant?: "recent" | "full";
}

export function ClientCampaignCard({
  campaign,
  variant = "recent",
}: ClientCampaignCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">
            {campaign.name}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {platformLabels[campaign.platform]}
            {variant === "full" ? ` · ${campaign.goal}` : null}
          </p>
        </div>
        <ClientStatusBadge status={campaign.status} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">Budget</dt>
          <dd className="font-medium text-zinc-900 dark:text-zinc-100">
            {formatLyd(campaign.budget)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">Spent</dt>
          <dd className="font-medium text-zinc-900 dark:text-zinc-100">
            {formatLyd(campaign.spent)}
          </dd>
        </div>

        {variant === "recent" ? (
          <div className="col-span-2">
            <dt className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
              Performance
            </dt>
            <dd>
              <PerformanceBar value={campaign.performance} />
            </dd>
          </div>
        ) : (
          <>
            <div>
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                Start
              </dt>
              <dd className="text-zinc-700 dark:text-zinc-300">
                {formatDate(campaign.startDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500 dark:text-zinc-400">End</dt>
              <dd className="text-zinc-700 dark:text-zinc-300">
                {formatDate(campaign.endDate)}
              </dd>
            </div>
          </>
        )}
      </dl>

      <Link
        href={`/user/campaigns/${campaign.id}`}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mt-4 w-full"
        )}
      >
        View Details
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
