"use client";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PerformanceBar } from "@/components/dashboard/performance-bar";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import { useLocale, useTranslations } from "@/providers/locale-provider";
import type { AdPlatform, Campaign } from "@/types";

interface RecentCampaignsTableProps {
  campaigns: Campaign[];
}

const platformKeys: Record<AdPlatform, string> = {
  meta: "platforms.meta",
  tiktok: "platforms.tiktok",
  google: "platforms.google",
};

export function RecentCampaignsTable({
  campaigns,
}: RecentCampaignsTableProps) {
  const t = useTranslations();
  const { locale } = useLocale();

  return (
    <DashboardCard className="overflow-hidden">
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-6">
        <SectionHeader
          title={t("table.recentCampaigns")}
          description={t("table.recentCampaignsDescription")}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-zinc-200 hover:bg-transparent dark:border-zinc-800">
            <TableHead className="ps-5 text-zinc-500 dark:text-zinc-400 sm:ps-6">
              {t("table.campaign")}
            </TableHead>
            <TableHead className="text-zinc-500 dark:text-zinc-400">
              {t("table.platform")}
            </TableHead>
            <TableHead className="text-zinc-500 dark:text-zinc-400">
              {t("table.budget")}
            </TableHead>
            <TableHead className="text-zinc-500 dark:text-zinc-400">
              {t("table.status")}
            </TableHead>
            <TableHead className="text-zinc-500 dark:text-zinc-400">
              {t("table.performance")}
            </TableHead>
            <TableHead className="pe-5 text-zinc-500 dark:text-zinc-400 sm:pe-6">
              {t("table.date")}
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
                  {t(platformKeys[campaign.platform])}
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">
                  {formatCurrency(campaign.budget, locale)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={campaign.status} />
                </TableCell>
                <TableCell>
                  <PerformanceBar value={campaign.performance} />
                </TableCell>
                <TableCell className="pe-5 text-zinc-600 dark:text-zinc-400 sm:pe-6">
                  {formatDate(campaign.date, locale)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </DashboardCard>
  );
}
