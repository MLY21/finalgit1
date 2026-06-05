"use client";

import { useMemo, useState } from "react";
import { Search, List, LayoutGrid } from "lucide-react";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ClientCampaignTable } from "@/components/client/client-campaign-table";
import { ClientStatusBadge } from "@/components/client/client-status-badge";
import { FilterSelect } from "@/components/client/filter-select";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientCampaigns } from "@/data/client-dashboard";
import { formatLyd, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const platformOptions = [
  { value: "all", label: "All platforms" },
  { value: "meta", label: "Meta Ads" },
  { value: "tiktok", label: "TikTok Ads" },
  { value: "google", label: "Google Ads" },
];

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
];

export default function UserCampaignsPage() {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [status, setStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "card">("card");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return clientCampaigns.filter((campaign) => {
      const matchesSearch =
        !query ||
        campaign.name.toLowerCase().includes(query) ||
        campaign.goal.toLowerCase().includes(query);
      const matchesPlatform = platform === "all" || campaign.platform === platform;
      const matchesStatus = status === "all" || campaign.status === status;
      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [search, platform, status]);

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="My Campaigns"
          description="Browse and review the advertising campaigns running for your account."
        />
        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
          {/* View Switcher Segmented Control */}
          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 bg-zinc-100 dark:bg-zinc-900/60 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer",
                viewMode === "list"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              <List className="size-3.5" />
              <span className="hidden sm:inline">List View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer",
                viewMode === "card"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              <LayoutGrid className="size-3.5" />
              <span className="hidden sm:inline">Card View</span>
            </button>
          </div>
        </div>
      </div>

      <DashboardCard className="p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Search
            </span>
            <div className="relative">
              <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or goal..."
                className="h-9 rounded-lg border-zinc-200 bg-zinc-50 ps-9 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              />
            </div>
          </label>

          <FilterSelect
            label="Platform"
            value={platform}
            options={platformOptions}
            onChange={setPlatform}
            className="md:w-44"
          />
          <FilterSelect
            label="Status"
            value={status}
            options={statusOptions}
            onChange={setStatus}
            className="md:w-44"
          />
        </div>
      </DashboardCard>

      {filtered.length > 0 ? (
        viewMode === "list" ? (
          <ClientCampaignTable campaigns={filtered} variant="full" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 space-y-4 shadow-xs hover:shadow-md transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Platform & Status Headers */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 border",
                      campaign.platform === "meta" && "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30",
                      campaign.platform === "google" && "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30",
                      campaign.platform === "tiktok" && "bg-zinc-100 text-zinc-900 border-zinc-200/50 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
                    )}>
                      {campaign.platform === "meta" ? "Meta Ads" : campaign.platform === "google" ? "Google Ads" : "TikTok Ads"}
                    </span>
                    <ClientStatusBadge status={campaign.status} />
                  </div>

                  {/* Name & Goal Info */}
                  <div className="space-y-1">
                    <Link
                      href={`/user/campaigns/${campaign.id}`}
                      className="font-bold text-zinc-900 dark:text-zinc-100 text-sm hover:text-zinc-700 dark:hover:text-zinc-300 hover:underline transition-all block truncate"
                    >
                      {campaign.name}
                    </Link>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Goal: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{campaign.goal}</span>
                    </p>
                  </div>

                  {/* Budget Details */}
                  <div className="grid grid-cols-3 gap-3 bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/40 text-xs">
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400">Budget</p>
                      <p className="text-zinc-900 dark:text-zinc-100 font-bold mt-0.5 truncate">{formatLyd(campaign.budget)}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400">Spent</p>
                      <p className="text-zinc-900 dark:text-zinc-100 font-bold mt-0.5 truncate">{formatLyd(campaign.spent)}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400 text-center">Leads</p>
                      <p className="text-zinc-900 dark:text-zinc-100 font-bold text-center mt-0.5">{campaign.leads}</p>
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                  <Button
                    render={<Link href={`/user/campaigns/${campaign.id}`} />}
                    variant="outline"
                    size="sm"
                    className="w-full h-9 rounded-lg text-xs font-semibold"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <DashboardCard className="flex min-h-[200px] items-center justify-center p-8">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            No campaigns match your filters.
          </p>
        </DashboardCard>
      )}
    </div>
  );
}
