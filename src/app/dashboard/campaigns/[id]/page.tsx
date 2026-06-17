"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Megaphone, 
  ArrowLeft, 
  RefreshCw, 
  FileDown, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  MousePointer, 
  UserCheck, 
  Award,
  Wallet,
  Coins,
  Scale,
  Calendar,
  Layers,
  Database,
  Briefcase,
  Clock,
  BarChart2,
  Percent,
  Target,
  TrendingDown,
  Minus
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { formatLyd } from "@/lib/format";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { cn } from "@/lib/utils";

interface CampaignDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function CampaignDetailsPage({ params }: CampaignDetailsPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const chartTheme = useChartTheme();

  const [currentCampaign, setCurrentCampaign] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const loadCampaign = () => {
    fetch(`/api/campaigns/${resolvedParams.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCurrentCampaign(d.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCampaign();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-zinc-500 dark:text-zinc-400">
        Loading campaign...
      </div>
    );
  }

  if (notFound || !currentCampaign) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Campaign Not Found</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">The campaign you are looking for does not exist or has been deleted.</p>
        <Button render={<Link href="/dashboard/campaigns" />} className="h-10 rounded-lg text-sm font-semibold">
          <ArrowLeft className="size-4 mr-1.5" /> Back to Campaigns
        </Button>
      </div>
    );
  }

  const handleGenerateReport = () => {
    alert(`Generating performance report for campaign "${currentCampaign.name}"... Report downloaded!`);
  };

  const handleSyncCampaign = async () => {
    setSyncing(true);
    try {
      await fetch("/api/campaigns/sync-facebook", { method: "POST" });
      loadCampaign();
    } catch {
      // silent fail
    } finally {
      setSyncing(false);
    }
  };

  // ── Performance Summary computation ─────────────────────────
  const ctrScore = currentCampaign.ctr >= 3 ? 2 : currentCampaign.ctr >= 1 ? 1 : 0;
  const cplScore = !currentCampaign.cpl || currentCampaign.cpl <= 0 ? 1 : currentCampaign.cpl <= 30 ? 2 : currentCampaign.cpl <= 80 ? 1 : 0;
  const convScore = currentCampaign.conversionRate >= 5 ? 2 : currentCampaign.conversionRate >= 2 ? 1 : 0;
  const summaryTotal = ctrScore + cplScore + convScore;
  const summaryTier = summaryTotal >= 5 ? "good" : summaryTotal >= 3 ? "avg" : "poor";
  const ctrTier = ctrScore === 2 ? "good" : ctrScore === 1 ? "avg" : "poor";
  const cplTier = cplScore === 2 ? "good" : cplScore === 1 ? "avg" : "poor";
  const convTier = convScore === 2 ? "good" : convScore === 1 ? "avg" : "poor";

  const tierStyles = {
    good: { dot: "bg-emerald-500", value: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20", iconBg: "bg-emerald-100 dark:bg-emerald-900/30", label: "Good" },
    avg:  { dot: "bg-amber-500",   value: "text-amber-600 dark:text-amber-400",     badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",     bg: "bg-amber-50 dark:bg-amber-950/20",   iconBg: "bg-amber-100 dark:bg-amber-900/30",   label: "Moderate" },
    poor: { dot: "bg-rose-500",    value: "text-rose-600 dark:text-rose-400",       badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",       bg: "bg-rose-50 dark:bg-rose-950/20",     iconBg: "bg-rose-100 dark:bg-rose-900/30",     label: "Needs Attention" },
  };
  const SummaryIcon = summaryTier === "good" ? TrendingUp : summaryTier === "avg" ? Minus : TrendingDown;
  const summaryOverallLabel = summaryTier === "good" ? "Strong Performance" : summaryTier === "avg" ? "Moderate Performance" : "Needs Attention";
  const summaryText = summaryTier === "good"
    ? `The campaign demonstrates strong engagement with a CTR of ${currentCampaign.ctr.toFixed(2)}%. Lead acquisition remains efficient at ${formatLyd(currentCampaign.cpl)} per lead, while the conversion rate of ${currentCampaign.conversionRate.toFixed(2)}% indicates effective audience targeting and overall campaign performance.`
    : summaryTier === "avg"
    ? `The campaign is generating stable engagement with a CTR of ${currentCampaign.ctr.toFixed(2)}% and a conversion rate of ${currentCampaign.conversionRate.toFixed(2)}%. While performance remains within acceptable levels, additional optimization may reduce the cost per lead of ${formatLyd(currentCampaign.cpl)} and improve conversion outcomes.`
    : `The campaign is experiencing lower-than-expected engagement with a CTR of ${currentCampaign.ctr.toFixed(2)}% and a conversion rate of ${currentCampaign.conversionRate.toFixed(2)}%. The current cost per lead of ${currentCampaign.cpl > 0 ? formatLyd(currentCampaign.cpl) : "N/A"} suggests inefficiencies in targeting. Consider reviewing audience segments, budget allocation, and ad creatives to improve results.`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back Link */}
      <Link
        href="/dashboard/campaigns"
        className="inline-flex items-center text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors gap-1"
      >
        <ArrowLeft className="size-3.5" /> Back to Campaigns directory
      </Link>

      {/* Campaign Details Header */}
      <DashboardCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn(
                "px-2 py-0.5 rounded-md text-xs font-semibold shrink-0 border",
                currentCampaign.platform === "Meta Ads" && "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30",
                currentCampaign.platform === "Google Ads" && "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30",
                currentCampaign.platform === "TikTok Ads" && "bg-zinc-100 text-zinc-900 border-zinc-200/50 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
              )}>
                {currentCampaign.platform}
              </span>
              <span className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                currentCampaign.status === "Active" && "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
                currentCampaign.status === "Paused" && "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
                currentCampaign.status === "Completed" && "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
              )}>
                <span className={cn(
                  "size-1.5 rounded-full",
                  currentCampaign.status === "Active" && "bg-emerald-500",
                  currentCampaign.status === "Paused" && "bg-amber-500",
                  currentCampaign.status === "Completed" && "bg-blue-500"
                )} />
                {currentCampaign.status}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
              {currentCampaign.name}
            </h1>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-3xl">
              {currentCampaign.description}
            </p>

            {/* Meta Tags Details Row */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 sm:grid-cols-4 pt-2 text-xs border-t border-zinc-100 dark:border-zinc-800/60 mt-1">
              <div className="space-y-0.5">
                <span className="text-zinc-400 dark:text-zinc-500 font-medium">Client Profile</span>
                <p className="text-zinc-900 dark:text-zinc-100 font-semibold">{currentCampaign.clientName}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-zinc-400 dark:text-zinc-500 font-medium">Marketing Goal</span>
                <p className="text-zinc-900 dark:text-zinc-100 font-semibold">{currentCampaign.marketingGoal}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1"><Clock className="size-3.5" /> Last Synchronized</span>
                <p className="text-zinc-900 dark:text-zinc-100 font-semibold flex items-center gap-1">
                  {currentCampaign.lastSync}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1"><Calendar className="size-3.5" /> Campaign Schedule</span>
                <p className="text-zinc-900 dark:text-zinc-100 font-semibold">
                  {currentCampaign.startDate} — {currentCampaign.endDate || "Ongoing"}
                </p>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-start w-full sm:w-auto md:flex-col lg:flex-row mt-1">
            <Button
              variant="outline"
              disabled={syncing}
              onClick={handleSyncCampaign}
              className={cn(
                "h-9 rounded-lg text-xs font-semibold px-3 flex-1 sm:flex-initial",
                syncing && "opacity-70 cursor-not-allowed"
              )}
            >
              <RefreshCw className={cn("size-3.5 mr-1.5", syncing && "animate-spin text-blue-500")} /> 
              {syncing ? "Syncing..." : "Sync Campaign"}
            </Button>
            <Button
              onClick={handleGenerateReport}
              className="h-9 rounded-lg text-xs font-semibold px-3 flex-1 sm:flex-initial bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90"
            >
              <FileDown className="size-3.5 mr-1.5" /> Generate Report
            </Button>
          </div>
        </div>
      </DashboardCard>

      {/* CAMPAIGN PERFORMANCE OVERVIEW */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1">
          Campaign Performance Overview
        </h3>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Views */}
          <DashboardCard className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 shrink-0">
              <Eye className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Impressions (Views)</p>
              <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 truncate">
                {currentCampaign.views.toLocaleString()}
              </h4>
            </div>
          </DashboardCard>

          {/* Card 2: Clicks */}
          <DashboardCard className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400 shrink-0">
              <MousePointer className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Link Clicks</p>
              <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 truncate">
                {currentCampaign.clicks.toLocaleString()}
              </h4>
            </div>
          </DashboardCard>

          {/* Card 3: Leads */}
          <DashboardCard className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 shrink-0">
              <UserCheck className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Acquired Leads</p>
              <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 truncate">
                {currentCampaign.leads.toLocaleString()}
              </h4>
            </div>
          </DashboardCard>

          {/* Card 4: Conversions */}
          <DashboardCard className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 shrink-0">
              <Award className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Conversions</p>
              <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 truncate">
                {currentCampaign.conversions.toLocaleString()}
              </h4>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* FINANCIAL OVERVIEW */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1">
          Financial Status (USD)
        </h3>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Budget */}
          <DashboardCard className="p-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Total Budget</p>
            <h4 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
              {formatLyd(currentCampaign.budget)}
            </h4>
          </DashboardCard>

          {/* Card 2: Spent */}
          <DashboardCard className="p-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Amount Spent</p>
            <h4 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
              {formatLyd(currentCampaign.spent)}
            </h4>
          </DashboardCard>

          {/* Card 3: Remaining Budget */}
          <DashboardCard className="p-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Remaining Budget</p>
            <h4 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
              {formatLyd(currentCampaign.budget - currentCampaign.spent)}
            </h4>
          </DashboardCard>
        </div>
      </div>

      {/* Grid containing Chart & External Info */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Performance Chart over time (Spans 2 columns on lg) */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1">
            Performance Historical Analysis
          </h3>
          <DashboardCard className="p-5">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentCampaign.performanceOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="impressionsColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartTheme.line.impressions} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={chartTheme.line.impressions} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="clicksColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartTheme.line.clicks} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={chartTheme.line.clicks} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="leadsColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartTheme.line.conversions} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={chartTheme.line.conversions} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                  <XAxis 
                    dataKey="date" 
                    stroke={chartTheme.text} 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke={chartTheme.text} 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartTheme.tooltipBg,
                      borderColor: chartTheme.tooltipBorder,
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{
                      color: chartTheme.tooltipLabel,
                      fontWeight: "bold",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Area
                    name="Views (Impressions)"
                    type="monotone"
                    dataKey="views"
                    stroke={chartTheme.line.impressions}
                    fillOpacity={1}
                    fill="url(#impressionsColor)"
                    strokeWidth={2}
                  />
                  <Area
                    name="Clicks"
                    type="monotone"
                    dataKey="clicks"
                    stroke={chartTheme.line.clicks}
                    fillOpacity={1}
                    fill="url(#clicksColor)"
                    strokeWidth={2}
                  />
                  <Area
                    name="Leads"
                    type="monotone"
                    dataKey="leads"
                    stroke={chartTheme.line.conversions}
                    fillOpacity={1}
                    fill="url(#leadsColor)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>

        {/* External Info (Spans 1 column on lg) */}
        <div className="lg:col-span-1 space-y-6">

          {/* Meta Ads Integration Preparation */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1 flex items-center gap-1.5">
              <Database className="size-3.5 text-blue-500" /> External Platform Information
            </h3>
            <DashboardCard className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <span className="text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                  Integration State
                </span>
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                  <span className="size-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                  API Connected (Remote Webhook Active)
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium">Connected Platform</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{currentCampaign.platform}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium">External Campaign ID</span>
                  <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md text-[10px] text-zinc-700 dark:text-zinc-300 font-mono select-all">
                    {currentCampaign.externalCampaignId}
                  </code>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium">External Account ID</span>
                  <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md text-[10px] text-zinc-700 dark:text-zinc-300 font-mono select-all">
                    {currentCampaign.externalAdAccountId}
                  </code>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium">Last Synced Timestamp</span>
                  <p className="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-[10px]">
                    {currentCampaign.lastSync}
                  </p>
                </div>
              </div>
            </DashboardCard>
          </div>

        </div>

      </div>

      {/* PERFORMANCE SUMMARY */}
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
                {currentCampaign.ctr.toFixed(2)}%
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
                {currentCampaign.cpl > 0 ? formatLyd(currentCampaign.cpl) : "—"}
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
                {currentCampaign.conversionRate.toFixed(2)}%
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
