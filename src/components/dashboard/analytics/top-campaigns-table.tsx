import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatLyd, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TopCampaign } from "@/data/analytics";

interface TopCampaignsTableProps {
  campaigns: TopCampaign[];
}

export function TopCampaignsTable({ campaigns }: TopCampaignsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-200 hover:bg-transparent dark:border-zinc-800">
            <TableHead className="ps-5 text-zinc-500 dark:text-zinc-400 sm:ps-6">
              Campaign Name
            </TableHead>
            <TableHead className="text-zinc-500 dark:text-zinc-400">
              Client
            </TableHead>
            <TableHead className="text-zinc-500 dark:text-zinc-400">
              Platform
            </TableHead>
            <TableHead className="text-zinc-500 dark:text-zinc-400 text-center">
              Leads
            </TableHead>
            <TableHead className="text-zinc-500 dark:text-zinc-400 text-center">
              Clicks
            </TableHead>
            <TableHead className="text-zinc-500 dark:text-zinc-400">
              Ad Spend
            </TableHead>
            <TableHead className="text-zinc-500 dark:text-zinc-400">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow
              key={campaign.id}
              className="border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
            >
              <TableCell className="ps-5 sm:ps-6 font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                <Link
                  href={`/dashboard/campaigns/${campaign.id}`}
                  className="hover:text-zinc-700 dark:hover:text-zinc-300 hover:underline transition-all cursor-pointer"
                >
                  {campaign.name}
                </Link>
              </TableCell>
              <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm">
                {campaign.client}
              </TableCell>
              <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                {campaign.platform}
              </TableCell>
              <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm text-center font-bold">
                {formatNumber(campaign.leads)}
              </TableCell>
              <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm text-center">
                {formatNumber(campaign.clicks)}
              </TableCell>
              <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm font-semibold">
                {formatLyd(campaign.adSpend)}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                    campaign.status === "active" &&
                      "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
                    campaign.status === "paused" &&
                      "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
                    campaign.status === "completed" &&
                      "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      campaign.status === "active" && "bg-emerald-500",
                      campaign.status === "paused" && "bg-amber-500",
                      campaign.status === "completed" && "bg-blue-500"
                    )}
                  />
                  {campaign.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
