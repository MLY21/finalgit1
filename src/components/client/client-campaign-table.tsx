import Link from "next/link";

import { ClientCampaignCard } from "@/components/client/client-campaign-card";
import { ClientStatusBadge } from "@/components/client/client-status-badge";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PerformanceBar } from "@/components/dashboard/performance-bar";
import { SectionHeader } from "@/components/dashboard/section-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatLyd } from "@/lib/format";
import { platformLabels } from "@/lib/platform-labels";
import { cn } from "@/lib/utils";
interface ClientCampaignTableProps {
  campaigns: any[];
  variant?: "recent" | "full";
  title?: string;
  description?: string;
}

const headClass = "text-zinc-500 dark:text-zinc-400";

export function ClientCampaignTable({
  campaigns,
  variant = "recent",
  title,
  description,
}: ClientCampaignTableProps) {
  const isFull = variant === "full";

  return (
    <DashboardCard className="overflow-hidden">
      {title ? (
        <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-6">
          <SectionHeader title={title} description={description} />
        </div>
      ) : null}

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-200 hover:bg-transparent dark:border-zinc-800">
              <TableHead className={cn("ps-5 sm:ps-6", headClass)}>Campaign</TableHead>
              <TableHead className={headClass}>Platform</TableHead>
              {isFull ? <TableHead className={headClass}>Goal</TableHead> : null}
              <TableHead className={headClass}>Status</TableHead>
              <TableHead className={headClass}>Budget</TableHead>
              <TableHead className={headClass}>Spent</TableHead>
              {isFull ? (
                <>
                  <TableHead className={headClass}>Start</TableHead>
                  <TableHead className={headClass}>End</TableHead>
                </>
              ) : (
                <>
                  <TableHead className={headClass}>Performance</TableHead>
                  <TableHead className={headClass}>Date</TableHead>
                </>
              )}
              <TableHead className={cn("pe-5 text-end sm:pe-6", headClass)}>
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow
                key={campaign.id}
                className="border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
              >
                <TableCell className="ps-5 font-medium text-zinc-900 dark:text-zinc-100 sm:ps-6">
                  {campaign.name}
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">
                  {platformLabels[(campaign.platform ?? "").toLowerCase() as keyof typeof platformLabels] ?? campaign.platform}
                </TableCell>
                {isFull ? (
                  <TableCell className="text-zinc-600 dark:text-zinc-400">
                    {campaign.marketingGoal ?? campaign.goal ?? "—"}
                  </TableCell>
                ) : null}
                <TableCell>
                  <ClientStatusBadge status={campaign.status} />
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">
                  {formatLyd(campaign.budget)}
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">
                  {formatLyd(campaign.spend ?? campaign.spent ?? 0)}
                </TableCell>
                {isFull ? (
                  <>
                    <TableCell className="text-zinc-600 dark:text-zinc-400">
                      {formatDate(campaign.startDate)}
                    </TableCell>
                    <TableCell className="text-zinc-600 dark:text-zinc-400">
                      {formatDate(campaign.endDate)}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>
                      <PerformanceBar value={campaign.performance ?? 0} />
                    </TableCell>
                    <TableCell className="text-zinc-600 dark:text-zinc-400">
                      {formatDate(campaign.startDate)}
                    </TableCell>
                  </>
                )}
                <TableCell className="pe-5 text-end sm:pe-6">
                  <Link
                    href={`/user/campaigns/${campaign.id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    View Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile stacked cards */}
      <div className="space-y-3 p-4 md:hidden">
        {campaigns.map((campaign) => (
          <ClientCampaignCard
            key={campaign.id}
            campaign={campaign}
            variant={variant}
          />
        ))}
      </div>
    </DashboardCard>
  );
}
