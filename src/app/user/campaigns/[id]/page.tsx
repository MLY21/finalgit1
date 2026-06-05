import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Target } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ClientPerformanceChart } from "@/components/client/client-performance-chart";
import { ClientStatusBadge } from "@/components/client/client-status-badge";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { buttonVariants } from "@/components/ui/button";
import { getClientCampaignById } from "@/data/client-dashboard";
import { formatDate, formatLyd, formatNumber } from "@/lib/format";
import { platformLabels } from "@/lib/platform-labels";
import { cn } from "@/lib/utils";

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "positive" | "negative";
}) {
  const valueClass =
    accent === "positive"
      ? "text-emerald-600 dark:text-emerald-400"
      : accent === "negative"
        ? "text-rose-600 dark:text-rose-400"
        : "text-zinc-900 dark:text-zinc-100";

  return (
    <DashboardCard className="p-4">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className={cn("mt-1.5 text-xl font-semibold tracking-tight", valueClass)}>
        {value}
      </p>
    </DashboardCard>
  );
}

export default async function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getClientCampaignById(id);

  if (!campaign) {
    notFound();
  }

  const remaining = campaign.budget - campaign.spent;
  const netProfit = campaign.revenue - campaign.spent;
  const ctr = campaign.views > 0 ? (campaign.clicks / campaign.views) * 100 : 0;
  const conversionRate =
    campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <Link
        href="/user/campaigns"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ms-2")}
      >
        <ArrowLeft className="size-4" />
        Back to campaigns
      </Link>

      {/* Header */}
      <DashboardCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {campaign.name}
              </h2>
              <ClientStatusBadge status={campaign.status} />
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {platformLabels[campaign.platform]}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-zinc-200 pt-5 dark:border-zinc-800 sm:grid-cols-3">
          <div className="flex items-center gap-2.5">
            <Target className="size-4 shrink-0 text-zinc-400" />
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Goal</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {campaign.goal}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <CalendarDays className="size-4 shrink-0 text-zinc-400" />
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Start date</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {formatDate(campaign.startDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <CalendarDays className="size-4 shrink-0 text-zinc-400" />
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">End date</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {formatDate(campaign.endDate)}
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Financial summary */}
      <div className="space-y-3">
        <SectionHeader title="Financial Summary" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Budget" value={formatLyd(campaign.budget)} />
          <Metric label="Spent" value={formatLyd(campaign.spent)} />
          <Metric label="Remaining" value={formatLyd(remaining)} />
          <Metric label="Revenue" value={formatLyd(campaign.revenue)} />
          <Metric
            label="Net Profit"
            value={formatLyd(netProfit)}
            accent={netProfit >= 0 ? "positive" : "negative"}
          />
        </div>
      </div>

      {/* Performance summary */}
      <div className="space-y-3">
        <SectionHeader title="Performance Summary" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          <Metric label="Views" value={formatNumber(campaign.views, { compact: true })} />
          <Metric label="Clicks" value={formatNumber(campaign.clicks, { compact: true })} />
          <Metric label="Leads" value={formatNumber(campaign.leads, { compact: true })} />
          <Metric label="Conversions" value={formatNumber(campaign.conversions, { compact: true })} />
          <Metric label="CTR" value={`${ctr.toFixed(2)}%`} />
          <Metric label="Conv. Rate" value={`${conversionRate.toFixed(2)}%`} />
        </div>
      </div>

      {/* Performance chart */}
      <ClientPerformanceChart
        data={campaign.performanceSeries}
        description="Views, clicks, and leads for this campaign"
      />

      {/* Expenses + Notes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard className="overflow-hidden">
          <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-6">
            <SectionHeader
              title="Expenses"
              description="Costs recorded for this campaign"
            />
          </div>
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {campaign.expenses.map((expense) => (
              <li
                key={expense.id}
                className="flex items-start justify-between gap-4 p-4 sm:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {expense.title}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(expense.date)}
                    {expense.notes ? ` · ${expense.notes}` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatLyd(expense.amount)}
                </span>
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard className="overflow-hidden">
          <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-6">
            <SectionHeader
              title="Notes & Updates"
              description="Latest updates from the marketing team"
            />
          </div>
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {campaign.notes.map((note) => (
              <li key={note.id} className="p-4 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {note.author}
                  </p>
                  <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(note.date)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {note.message}
                </p>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>
    </div>
  );
}
