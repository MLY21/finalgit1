import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { ClientStatusBadge } from "@/components/client/client-status-badge";
import { PerformanceBar } from "@/components/dashboard/performance-bar";
import { Button } from "@/components/ui/button";
import { formatDate, formatLyd } from "@/lib/format";
import { platformLabels } from "@/lib/platform-labels";
import { cn } from "@/lib/utils";
interface ClientCampaignCardProps {
  campaign: any;
  variant?: "recent" | "full";
}

export function ClientCampaignCard({
  campaign,
  variant = "recent",
}: ClientCampaignCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col">
      {/* Platform Header with Icon */}
      <div className={cn(
        "p-4 pb-3",
        campaign.platform === "meta" && "bg-gradient-to-br from-blue-400 to-blue-500",
        campaign.platform === "google" && "bg-gradient-to-br from-rose-400 to-rose-500",
        campaign.platform === "tiktok" && "bg-gradient-to-br from-slate-400 to-slate-500"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              {campaign.platform === "meta" && (
                <svg className="size-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              )}
              {campaign.platform === "google" && (
                <svg className="size-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              )}
              {campaign.platform === "tiktok" && (
                <svg className="size-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-white/80">Platform</p>
              <p className="text-sm font-bold text-white">{platformLabels[(campaign.platform ?? "").toLowerCase() as keyof typeof platformLabels] ?? campaign.platform}</p>
            </div>
          </div>
          <ClientStatusBadge status={campaign.status} />
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 flex flex-col">
        {/* Name & Goal Info */}
        <div className="space-y-1">
          <p className="font-bold text-foreground text-base truncate">
            {campaign.name}
          </p>
          {variant === "full" && (
            <p className="text-xs text-muted-foreground font-medium">
              Goal: <span className="font-semibold text-foreground/80">{campaign.marketingGoal ?? campaign.goal ?? "—"}</span>
            </p>
          )}
        </div>

        {/* Budget & Spent */}
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Budget</dt>
            <dd className="font-medium text-foreground">
              {formatLyd(campaign.budget)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Spent</dt>
            <dd className="font-medium text-foreground">
              {formatLyd(campaign.spend ?? campaign.spent ?? 0)}
            </dd>
          </div>
        </dl>

        {variant === "recent" ? (
          <div>
            <dt className="mb-1 text-xs text-muted-foreground">
              Performance
            </dt>
            <dd>
              <PerformanceBar value={campaign.performance ?? 0} />
            </dd>
          </div>
        ) : (
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Start</dt>
              <dd className="text-foreground/80">
                {formatDate(campaign.startDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">End</dt>
              <dd className="text-foreground/80">
                {formatDate(campaign.endDate)}
              </dd>
            </div>
          </dl>
        )}
      </div>

      <div className="p-4 pt-0">
        <Link
          href={`/user/campaigns/${campaign.id}`}
          className="flex items-center justify-center gap-2 w-full h-10 rounded-lg border border-border bg-secondary hover:bg-accent hover:text-primary text-sm font-medium transition-colors"
        >
          View Details
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
