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
            {filtered.map((campaign) => {
              const platformName = campaign.platform === "meta" ? "Meta Ads" : campaign.platform === "google" ? "Google Ads" : "TikTok Ads";
              return (
                <div
                  key={campaign.id}
                  className="rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col"
                >
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
                          <p className="text-sm font-bold text-white">{platformName}</p>
                        </div>
                      </div>
                      <ClientStatusBadge status={campaign.status} />
                    </div>
                  </div>

                  <div className="p-4 space-y-4 flex-1 flex flex-col">
                    {/* Name & Goal Info */}
                    <div className="space-y-1">
                      <Link
                        href={`/user/campaigns/${campaign.id}`}
                        className="font-bold text-foreground text-base hover:text-primary hover:underline transition-all block truncate"
                      >
                        {campaign.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        Goal: <span className="font-semibold text-foreground/80">{campaign.goal}</span>
                      </p>
                    </div>

                    {/* Budget Details */}
                    <div className="grid grid-cols-3 gap-3 bg-secondary p-3 rounded-lg border border-border text-xs">
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="text-foreground font-bold mt-0.5 truncate">{formatLyd(campaign.budget)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Spent</p>
                        <p className="text-foreground font-bold mt-0.5 truncate">{formatLyd(campaign.spent)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-center">Leads</p>
                        <p className="text-foreground font-bold text-center mt-0.5">{campaign.leads}</p>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="p-4 pt-0">
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
              );
            })}
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
