"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpDown,
  BarChart2,
  Equal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { formatLyd } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CampaignData {
  id: string;
  name: string;
  platform: string;
  status: string;
  marketingGoal: string;
  budget: number;
  spend: number;
  remaining: number;
  impressions: number;
  clicks: number;
  messages: number;
  conversions: number;
  ctr: number;
  cpl: number;
  conversionRate: number;
}

type Winner = "A" | "B" | "Equal" | "N/A";

interface MetricRow {
  label: string;
  valueA: string;
  valueB: string;
  rawA: number;
  rawB: number;
  winner: Winner;
}

function computeWinner(a: number, b: number, higherIsBetter: boolean, skipIfZero = false): Winner {
  if (skipIfZero && a === 0 && b === 0) return "N/A";
  if (a === b) return "Equal";
  if (higherIsBetter) return a > b ? "A" : "B";
  if (skipIfZero) {
    if (a === 0) return "B";
    if (b === 0) return "A";
  }
  return a < b ? "A" : "B";
}

function buildRows(a: CampaignData, b: CampaignData): MetricRow[] {
  const fmt  = (n: number) => formatLyd(n);
  const num  = (n: number) => n.toLocaleString();
  const pct  = (n: number) => `${n.toFixed(2)}%`;

  return [
    { label: "Budget",           valueA: fmt(a.budget),         valueB: fmt(b.budget),         rawA: a.budget,         rawB: b.budget,         winner: "N/A" },
    { label: "Amount Spent",     valueA: fmt(a.spend),          valueB: fmt(b.spend),          rawA: a.spend,          rawB: b.spend,          winner: computeWinner(a.spend,          b.spend,          false) },
    { label: "Remaining Budget", valueA: fmt(a.remaining),      valueB: fmt(b.remaining),      rawA: a.remaining,      rawB: b.remaining,      winner: computeWinner(a.remaining,      b.remaining,      true) },
    { label: "Impressions",      valueA: num(a.impressions),    valueB: num(b.impressions),    rawA: a.impressions,    rawB: b.impressions,    winner: computeWinner(a.impressions,    b.impressions,    true) },
    { label: "Clicks",           valueA: num(a.clicks),         valueB: num(b.clicks),         rawA: a.clicks,         rawB: b.clicks,         winner: computeWinner(a.clicks,         b.clicks,         true) },
    { label: "Messages",         valueA: num(a.messages),       valueB: num(b.messages),       rawA: a.messages,       rawB: b.messages,       winner: computeWinner(a.messages,       b.messages,       true) },
    { label: "Conversions",      valueA: num(a.conversions),    valueB: num(b.conversions),    rawA: a.conversions,    rawB: b.conversions,    winner: computeWinner(a.conversions,    b.conversions,    true) },
    { label: "CTR",              valueA: pct(a.ctr),            valueB: pct(b.ctr),            rawA: a.ctr,            rawB: b.ctr,            winner: computeWinner(a.ctr,            b.ctr,            true) },
    { label: "CPL",              valueA: a.cpl > 0 ? fmt(a.cpl) : "—", valueB: b.cpl > 0 ? fmt(b.cpl) : "—", rawA: a.cpl, rawB: b.cpl, winner: computeWinner(a.cpl, b.cpl, false, true) },
    { label: "Conversion Rate",  valueA: pct(a.conversionRate), valueB: pct(b.conversionRate), rawA: a.conversionRate, rawB: b.conversionRate, winner: computeWinner(a.conversionRate, b.conversionRate, true) },
  ];
}

function getSummaryTier(rows: MetricRow[]): "good" | "avg" {
  const scored = rows.filter((r) => r.winner !== "N/A" && r.winner !== "Equal");
  const diff   = Math.abs(
    scored.filter((r) => r.winner === "A").length -
    scored.filter((r) => r.winner === "B").length
  );
  return diff >= 3 ? "good" : "avg";
}

const summaryStyles = {
  good: {
    iconBg: "bg-emerald-500 dark:bg-emerald-600",
    icon:   "text-white",
    badge:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    bg:     "bg-emerald-100 dark:bg-emerald-900/30",
    text:   "text-emerald-800 dark:text-emerald-200",
    label:  "Clear Advantage",
  },
  avg: {
    iconBg: "bg-amber-500 dark:bg-amber-600",
    icon:   "text-white",
    badge:  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    bg:     "bg-amber-100 dark:bg-amber-900/30",
    text:   "text-amber-800 dark:text-amber-200",
    label:  "Close Match",
  },
} as const;

function buildExecutiveSummary(a: CampaignData, b: CampaignData, rows: MetricRow[]): string {
  const scored  = rows.filter((r) => r.winner !== "N/A" && r.winner !== "Equal");
  const winsA   = scored.filter((r) => r.winner === "A");
  const winsB   = scored.filter((r) => r.winner === "B");
  const diff    = Math.abs(winsA.length - winsB.length);
  const isClose = diff < 3;

  // ── Helpers ──────────────────────────────────────────────────
  const metricLabel: Record<string, string> = {
    CTR: "a higher click-through rate",
    CPL: "a lower cost per lead",
    "Conversion Rate": "better conversion efficiency",
    Messages: "more messages",
    Impressions: "higher reach",
    Clicks: "more clicks",
    Conversions: "more conversions",
    "Amount Spent": "lower spend",
    "Remaining Budget": "more remaining budget",
  };

  const describe = (wins: MetricRow[]) =>
    wins
      .slice(0, 3)
      .map((r) => metricLabel[r.label] ?? r.label.toLowerCase())
      .join(", ");

  // ── Close match ──────────────────────────────────────────────
  if (isClose) {
    if (winsA.length === 0 && winsB.length === 0) {
      return `${a.name} and ${b.name} show identical performance across all comparable metrics. Neither campaign holds a measurable advantage.`;
    }
    const edgeA = winsA.length > 0 ? ` ${a.name} edges ahead in ${describe(winsA)}.` : "";
    const edgeB = winsB.length > 0 ? ` ${b.name} leads in ${describe(winsB)}.` : "";
    return `${a.name} and ${b.name} show closely matched performance with no significant overall advantage.${edgeA}${edgeB} Both campaigns are competitive and the gap between them is narrow.`;
  }

  // ── Clear winner ─────────────────────────────────────────────
  const leader  = winsA.length > winsB.length ? a : b;
  const trailer = winsA.length > winsB.length ? b : a;
  const ldrWins = winsA.length > winsB.length ? winsA : winsB;
  const trlWins = winsA.length > winsB.length ? winsB : winsA;

  let text = `${leader.name} is currently outperforming ${trailer.name}. The campaign achieved ${describe(ldrWins)}, making it the stronger performer overall.`;

  if (trlWins.length > 0) {
    text += ` ${trailer.name}, however, delivered ${describe(trlWins)}, which is worth noting.`;
  }

  return text;
}

function WinnerCell({ winner }: { winner: Winner }) {
  if (winner === "N/A") {
    return <span className="text-zinc-400 dark:text-zinc-600 text-xs font-medium">—</span>;
  }
  if (winner === "Equal") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
        <Equal className="size-3" /> Equal
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
      <TrendingUp className="size-3" /> Campaign {winner}
    </span>
  );
}

export default function CompareCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading]     = useState(true);
  const [idA, setIdA]             = useState("");
  const [idB, setIdB]             = useState("");
  const [compared, setCompared]   = useState(false);

  useEffect(() => {
    fetch("/api/user/campaigns")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCampaigns(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const campA      = campaigns.find((c) => c.id === idA);
  const campB      = campaigns.find((c) => c.id === idB);
  const rows       = compared && campA && campB ? buildRows(campA, campB) : [];
  const execSummary  = compared && campA && campB ? buildExecutiveSummary(campA, campB, rows) : "";
  const summaryTier  = rows.length > 0 ? getSummaryTier(rows) : "avg";
  const SummaryIcon  = summaryTier === "good" ? TrendingUp : Equal;

  const canCompare = !!idA && !!idB && idA !== idB;

  const selectClass =
    "h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 transition-colors cursor-pointer font-medium";

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <Link href="/user/campaigns" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ms-2")}>
        <ArrowLeft className="size-4" />
        Back to campaigns
      </Link>

      <PageHeader
        title="Campaign Comparison"
        description="Select two of your campaigns to compare their performance side by side."
      />

      {/* Selector Card */}
      <DashboardCard className="p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr_auto]">

          {/* Campaign A */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Campaign A</label>
            {loading ? (
              <div className="h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ) : (
              <select
                value={idA}
                onChange={(e) => { setIdA(e.target.value); setCompared(false); }}
                className={selectClass}
              >
                <option value="">Select campaign…</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id} disabled={c.id === idB}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* VS Badge */}
          <div className="hidden sm:flex items-end pb-1">
            <div className="flex size-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-extrabold text-zinc-500 dark:text-zinc-400 shrink-0">
              VS
            </div>
          </div>

          {/* Campaign B */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Campaign B</label>
            {loading ? (
              <div className="h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ) : (
              <select
                value={idB}
                onChange={(e) => { setIdB(e.target.value); setCompared(false); }}
                className={selectClass}
              >
                <option value="">Select campaign…</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id} disabled={c.id === idA}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Compare Button */}
          <div className="hidden sm:flex items-end pb-0.5">
            <Button
              disabled={!canCompare}
              onClick={() => setCompared(true)}
              className="h-10 px-5 rounded-lg text-sm font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 shrink-0"
            >
              <ArrowUpDown className="size-4 mr-1.5" />
              Compare
            </Button>
          </div>
        </div>

        {/* Mobile Compare Button */}
        <div className="mt-4 sm:hidden">
          <Button
            disabled={!canCompare}
            onClick={() => setCompared(true)}
            className="h-10 w-full rounded-lg text-sm font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90"
          >
            <ArrowUpDown className="size-4 mr-1.5" />
            Compare
          </Button>
        </div>

        {idA && idB && idA === idB && (
          <p className="mt-3 text-xs text-rose-500 font-medium">Please select two different campaigns.</p>
        )}
      </DashboardCard>

      {/* Comparison Table */}
      {compared && campA && campB && (
        <>
          <DashboardCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60">
                    <th className="py-3.5 px-5 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider w-40 border-r border-zinc-200 dark:border-zinc-800">
                      Metric
                    </th>
                    <th className="py-3.5 px-5 text-center text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-r border-zinc-200 dark:border-zinc-800">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-blue-500 inline-block" />
                        {campA.name}
                      </span>
                    </th>
                    <th className="py-3.5 px-5 text-center text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-r border-zinc-200 dark:border-zinc-800">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-violet-500 inline-block" />
                        {campB.name}
                      </span>
                    </th>
                    <th className="py-3.5 px-5 text-center text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Better Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {rows.map((row) => {
                    const aWins = row.winner === "A";
                    const bWins = row.winner === "B";
                    return (
                      <tr key={row.label} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                        <td className="py-3.5 px-5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap border-r border-zinc-100 dark:border-zinc-800/60">
                          {row.label}
                        </td>
                        <td className="py-3.5 px-5 text-center border-r border-zinc-100 dark:border-zinc-800/60">
                          <span className={cn(
                            "text-sm font-semibold",
                            aWins  ? "text-emerald-600 dark:text-emerald-400" : "",
                            bWins  ? "text-zinc-400 dark:text-zinc-600" : "",
                            row.winner === "Equal" ? "text-zinc-700 dark:text-zinc-300" : "",
                            row.winner === "N/A"   ? "text-zinc-700 dark:text-zinc-300" : "",
                          )}>
                            {aWins && <TrendingUp className="size-3 inline mr-1 mb-0.5" />}
                            {bWins && <TrendingDown className="size-3 inline mr-1 mb-0.5" />}
                            {row.valueA}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-center border-r border-zinc-100 dark:border-zinc-800/60">
                          <span className={cn(
                            "text-sm font-semibold",
                            bWins  ? "text-emerald-600 dark:text-emerald-400" : "",
                            aWins  ? "text-zinc-400 dark:text-zinc-600" : "",
                            row.winner === "Equal" ? "text-zinc-700 dark:text-zinc-300" : "",
                            row.winner === "N/A"   ? "text-zinc-700 dark:text-zinc-300" : "",
                          )}>
                            {bWins && <TrendingUp className="size-3 inline mr-1 mb-0.5" />}
                            {aWins && <TrendingDown className="size-3 inline mr-1 mb-0.5" />}
                            {row.valueB}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <WinnerCell winner={row.winner} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DashboardCard>

          {/* Campaign Comparison Summary */}
          {execSummary && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 px-1">
                Campaign Comparison Summary
              </h3>
              <DashboardCard className="p-6 space-y-5">

                {/* Header row */}
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-xl shrink-0", summaryStyles[summaryTier].iconBg)}>
                    <SummaryIcon className={cn("size-5", summaryStyles[summaryTier].icon)} />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Performance Analysis</h4>
                  <span className={cn("ml-auto px-3 py-1 rounded-full text-xs font-semibold shrink-0", summaryStyles[summaryTier].badge)}>
                    {summaryStyles[summaryTier].label}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-100 dark:border-zinc-800" />

                {/* Summary text */}
                <div className={cn("rounded-xl p-4", summaryStyles[summaryTier].bg)}>
                  <p className={cn("text-sm leading-relaxed font-medium", summaryStyles[summaryTier].text)}>
                    {execSummary}
                  </p>
                </div>

              </DashboardCard>
            </div>
          )}
        </>
      )}

      {/* Empty state before comparing */}
      {!compared && (
        <DashboardCard className="flex min-h-[200px] flex-col items-center justify-center gap-3 p-8">
          <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <ArrowUpDown className="size-6 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 text-center">
            Select two campaigns above and click <strong>Compare</strong> to see a detailed side-by-side analysis.
          </p>
        </DashboardCard>
      )}
    </div>
  );
}
