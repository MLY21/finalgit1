"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Minus, Target, TrendingDown, TrendingUp, Database } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ClientPerformanceChart } from "@/components/client/client-performance-chart";
import { ClientStatusBadge } from "@/components/client/client-status-badge";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, formatLyd } from "@/lib/format";
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

export default function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/campaigns/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCampaign(d.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs />
        <div className="flex items-center justify-center h-96 text-zinc-400">Loading campaign...</div>
      </div>
    );
  }

  if (!campaign) {
    notFound();
  }

  const remaining = campaign.budget - campaign.spent;
  const ctr = campaign.views > 0 ? (campaign.clicks / campaign.views) * 100 : 0;
  const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;
  const cpl = campaign.messages > 0 ? campaign.spent / campaign.messages : 0;

  // ── Performance Summary tier scoring ─────────────────────────
  const ctrScore  = ctr >= 3 ? 2 : ctr >= 1 ? 1 : 0;
  const cplScore  = cpl <= 0 ? 1 : cpl <= 30 ? 2 : cpl <= 80 ? 1 : 0;
  const convScore = conversionRate >= 5 ? 2 : conversionRate >= 2 ? 1 : 0;
  const summaryTotal = ctrScore + cplScore + convScore;
  const summaryTier  = summaryTotal >= 5 ? "good" : summaryTotal >= 3 ? "avg" : "poor";
  const ctrTier  = ctrScore  === 2 ? "good" : ctrScore  === 1 ? "avg" : "poor";
  const cplTier  = cplScore  === 2 ? "good" : cplScore  === 1 ? "avg" : "poor";
  const convTier = convScore === 2 ? "good" : convScore === 1 ? "avg" : "poor";

  const tierStyles = {
    good: { dot: "bg-emerald-500", value: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20", iconBg: "bg-emerald-100 dark:bg-emerald-900/30", label: "Good" },
    avg:  { dot: "bg-amber-500",   value: "text-amber-600 dark:text-amber-400",     badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",     bg: "bg-amber-50 dark:bg-amber-950/20",   iconBg: "bg-amber-100 dark:bg-amber-900/30",   label: "Moderate" },
    poor: { dot: "bg-rose-500",    value: "text-rose-600 dark:text-rose-400",       badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",       bg: "bg-rose-50 dark:bg-rose-950/20",     iconBg: "bg-rose-100 dark:bg-rose-900/30",     label: "Needs Attention" },
  };
  const SummaryIcon = summaryTier === "good" ? TrendingUp : summaryTier === "avg" ? Minus : TrendingDown;
  const summaryOverallLabel = summaryTier === "good" ? "Strong Performance" : summaryTier === "avg" ? "Moderate Performance" : "Needs Attention";
  const summaryText = summaryTier === "good"
    ? `The campaign demonstrates strong engagement with a CTR of ${ctr.toFixed(2)}%. Lead acquisition remains efficient at ${formatLyd(cpl)} per lead, while the conversion rate of ${conversionRate.toFixed(2)}% indicates effective audience targeting and overall campaign performance.`
    : summaryTier === "avg"
    ? `The campaign is generating stable engagement with a CTR of ${ctr.toFixed(2)}% and a conversion rate of ${conversionRate.toFixed(2)}%. While performance remains within acceptable levels, additional optimization may reduce the cost per lead of ${formatLyd(cpl)} and improve conversion outcomes.`
    : `The campaign is experiencing lower-than-expected engagement with a CTR of ${ctr.toFixed(2)}% and a conversion rate of ${conversionRate.toFixed(2)}%. The current cost per lead of ${cpl > 0 ? formatLyd(cpl) : "N/A"} suggests inefficiencies in targeting. Consider reviewing audience segments, budget allocation, and ad creatives to improve results.`;

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
              {platformLabels[(campaign.platform ?? "").toUpperCase() as keyof typeof platformLabels] ?? campaign.platform}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-zinc-200 pt-5 dark:border-zinc-800 sm:grid-cols-3">
          <div className="flex items-center gap-2.5">
            <Target className="size-4 shrink-0 text-zinc-400" />
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Goal</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {campaign.marketingGoal}
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
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <Metric label="Budget" value={formatLyd(campaign.budget)} />
          <Metric label="Spent" value={formatLyd(campaign.spent)} />
          <Metric label="Remaining" value={formatLyd(remaining)} />
        </div>
      </div>

      {/* Performance chart */}
      <ClientPerformanceChart
        data={campaign.performanceOverTime}
        description="Views, clicks, and leads for this campaign"
      />

      {/* Performance Summary */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1">
          Performance Summary
        </h3>
        <DashboardCard className="p-6 space-y-5">

          {/* Header row */}
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-xl shrink-0", tierStyles[summaryTier].iconBg)}>
              <SummaryIcon className={cn("size-5", tierStyles[summaryTier].value)} />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Overall Campaign Health</p>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{summaryOverallLabel}</h4>
            </div>
            <span className={cn("ml-auto px-3 py-1 rounded-full text-xs font-semibold", tierStyles[summaryTier].badge)}>
              {tierStyles[summaryTier].label}
            </span>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">

            {/* CTR */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full shrink-0", tierStyles[ctrTier].dot)} />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Click-Through Rate</p>
              </div>
              <p className={cn("text-2xl font-extrabold", tierStyles[ctrTier].value)}>
                {ctr.toFixed(2)}%
              </p>
              <p className="text-[10px] text-zinc-400">clicks ÷ impressions × 100</p>
            </div>

            {/* CPL */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full shrink-0", tierStyles[cplTier].dot)} />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Cost Per Lead</p>
              </div>
              <p className={cn("text-2xl font-extrabold", tierStyles[cplTier].value)}>
                {cpl > 0 ? formatLyd(cpl) : "—"}
              </p>
              <p className="text-[10px] text-zinc-400">total spend ÷ leads</p>
            </div>

            {/* Conversion Rate */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full shrink-0", tierStyles[convTier].dot)} />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Conversion Rate</p>
              </div>
              <p className={cn("text-2xl font-extrabold", tierStyles[convTier].value)}>
                {conversionRate.toFixed(2)}%
              </p>
              <p className="text-[10px] text-zinc-400">conversions ÷ clicks × 100</p>
            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-zinc-100 dark:border-zinc-800" />

          {/* Dynamic executive summary text */}
          <div className={cn("rounded-xl p-4", tierStyles[summaryTier].bg)}>
            <p className={cn("text-sm leading-relaxed font-medium", tierStyles[summaryTier].value)}>
              {summaryText}
            </p>
          </div>

        </DashboardCard>
      </div>

    </div>
  );
}
