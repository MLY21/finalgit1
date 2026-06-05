"use client";

import { use, useState } from "react";
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
  Clock
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockCampaigns, CampaignDetails } from "@/data/campaigns";
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

  const campaign = mockCampaigns.find((c) => c.id === resolvedParams.id);

  const [currentCampaign, setCurrentCampaign] = useState<CampaignDetails | undefined>(campaign);
  const [syncing, setSyncing] = useState(false);

  if (!currentCampaign) {
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
    // Simulate real-time synchronization with ad platform APIs (Meta, Google, TikTok)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    
    setCurrentCampaign((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lastSync: formattedDate,
        // Simulate a slight metric increase on sync to make it realistic
        views: prev.views + Math.floor(Math.random() * 250) + 50,
        clicks: prev.clicks + Math.floor(Math.random() * 15) + 2,
        leads: prev.leads + (Math.random() > 0.7 ? 1 : 0),
      };
    });
    setSyncing(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumb and Back Navigation */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/dashboard/campaigns" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Campaigns
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold truncate max-w-[200px]" title={currentCampaign.name}>
            {currentCampaign.name}
          </span>
        </div>
        
        {/* Back Link */}
        <Link 
          href="/dashboard/campaigns" 
          className="inline-flex items-center text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors gap-1"
        >
          <ArrowLeft className="size-3.5" /> Back to Campaigns directory
        </Link>
      </div>

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
          Financial Status (LYD)
        </h3>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
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

          {/* Card 4: Revenue */}
          <DashboardCard className="p-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Total Revenue</p>
            <h4 className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatLyd(currentCampaign.revenue)}
            </h4>
          </DashboardCard>

          {/* Card 5: Profit */}
          <DashboardCard className="p-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Net Profit</p>
            <h4 className="text-base font-extrabold text-blue-600 dark:text-blue-400 mt-1">
              {formatLyd(currentCampaign.profit)}
            </h4>
          </DashboardCard>
        </div>
      </div>

      {/* Grid containing Chart & Expenses / External Info */}
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

        {/* Expenses and External Info (Spans 1 column on lg) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Expenses Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1">
              Campaign Ad Spend & Expenses
            </h3>
            <DashboardCard className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10">
                    <TableHead className="ps-4 text-zinc-500 dark:text-zinc-400 text-xs">
                      Expense Name
                    </TableHead>
                    <TableHead className="pe-4 text-zinc-500 dark:text-zinc-400 text-end text-xs">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCampaign.expenses.map((expense, idx) => (
                    <TableRow 
                      key={idx} 
                      className="border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-xs"
                    >
                      <TableCell className="ps-4 py-3 min-w-0">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[170px]" title={expense.name}>
                          {expense.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{expense.date}</p>
                      </TableCell>
                      <TableCell className="pe-4 py-3 text-end font-bold text-zinc-800 dark:text-zinc-200">
                        {formatLyd(expense.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DashboardCard>
          </div>

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
    </div>
  );
}
