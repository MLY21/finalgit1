"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Megaphone, 
  Search, 
  UploadCloud, 
  RefreshCw, 
  Trash2, 
  ChevronRight,
  Database,
  Layers,
  Clock,
  List,
  LayoutGrid
} from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignDetails[]>(mockCampaigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("All Platforms");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "card">("card");

  const handleDeleteCampaign = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete campaign "${name}"?`)) {
      setCampaigns(campaigns.filter((camp) => camp.id !== id));
      alert(`Campaign "${name}" has been removed from the synchronized list.`);
    }
  };

  const handleSyncCampaign = async (id: string, name: string) => {
    setSyncingId(id);
    // Simulate real-time API sync
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCampaigns((prev) =>
      prev.map((camp) => {
        if (camp.id === id) {
          const now = new Date();
          const pad = (n: number) => String(n).padStart(2, '0');
          const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
          return { ...camp, lastSync: formattedDate };
        }
        return camp;
      })
    );
    setSyncingId(null);
  };

  const filteredCampaigns = campaigns.filter((camp) => {
    const matchesSearch =
      camp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlatform = platformFilter === "All Platforms" || camp.platform === platformFilter;
    const matchesStatus = statusFilter === "All" || camp.status === statusFilter;

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Campaigns"
          description="Manage and monitor all advertising campaigns across different platforms."
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

          <Button
            render={<Link href="/dashboard/campaigns/import" />}
            className="h-10 rounded-lg px-4 text-sm font-semibold shrink-0 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 shadow-sm"
          >
            <UploadCloud className="size-4 mr-1.5" />
            Import Campaigns
          </Button>
        </div>
      </div>

      {/* Main Container containing Action Bar and Content */}
      <DashboardCard className="overflow-hidden">
        {/* Action Bar */}
        <div className="flex flex-col gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 sm:flex-row sm:items-center sm:p-5">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="search"
              placeholder="Search campaigns by name or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-lg border-zinc-200 bg-zinc-50 ps-10 text-sm dark:border-zinc-800 dark:bg-zinc-900 w-full"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
            {/* Platform Filter */}
            <div className="w-full sm:w-44">
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 transition-colors w-full cursor-pointer font-semibold"
              >
                <option value="All Platforms">All Platforms</option>
                <option value="Meta Ads">Meta Ads</option>
                <option value="Google Ads">Google Ads</option>
                <option value="TikTok Ads">TikTok Ads</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-36">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setSearchQuery("");
                  setStatusFilter(e.target.value);
                }}
                className="h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 transition-colors w-full cursor-pointer font-semibold"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop/Tablet LIST VIEW (hidden on mobile or when card mode selected) */}
        {viewMode === "list" ? (
          <div className="hidden md:block overflow-x-auto">
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
                  <TableHead className="text-zinc-500 dark:text-zinc-400">
                    Status
                  </TableHead>
                  <TableHead className="text-zinc-500 dark:text-zinc-400">
                    Budget
                  </TableHead>
                  <TableHead className="text-zinc-500 dark:text-zinc-400 text-center">
                    Leads
                  </TableHead>
                  <TableHead className="text-zinc-500 dark:text-zinc-400">
                    Last Sync
                  </TableHead>
                  <TableHead className="pe-5 text-zinc-500 dark:text-zinc-400 text-end sm:pe-6 w-[220px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map((camp) => {
                    const isSyncing = syncingId === camp.id;
                    return (
                      <TableRow
                        key={camp.id}
                        className="border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                      >
                        <TableCell className="ps-5 sm:ps-6 font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                          <Link
                            href={`/dashboard/campaigns/${camp.id}`}
                            className="hover:text-zinc-700 dark:hover:text-zinc-300 hover:underline transition-all cursor-pointer"
                          >
                            {camp.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm">
                          {camp.clientName}
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-xs font-semibold shrink-0",
                            camp.platform === "Meta Ads" && "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
                            camp.platform === "Google Ads" && "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400",
                            camp.platform === "TikTok Ads" && "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                          )}>
                            {camp.platform}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                            camp.status === "Active" && "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
                            camp.status === "Paused" && "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
                            camp.status === "Completed" && "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
                          )}>
                            <span className={cn(
                              "size-1.5 rounded-full",
                              camp.status === "Active" && "bg-emerald-500",
                              camp.status === "Paused" && "bg-amber-500",
                              camp.status === "Completed" && "bg-blue-500"
                            )} />
                            {camp.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm font-semibold">
                          {formatLyd(camp.budget)}
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm text-center font-bold">
                          {camp.leads}
                        </TableCell>
                        <TableCell className="text-zinc-500 dark:text-zinc-400 text-xs">
                          <span className="flex items-center gap-1.5">
                            <Clock className="size-3.5 text-zinc-400 shrink-0" />
                            {camp.lastSync}
                          </span>
                        </TableCell>
                        <TableCell className="pe-5 text-end sm:pe-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              render={<Link href={`/dashboard/campaigns/${camp.id}`} />}
                              variant="ghost"
                              size="sm"
                              className="h-8 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 px-2.5"
                            >
                              View Details
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isSyncing}
                              className={cn(
                                "size-8 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                                isSyncing && "animate-spin cursor-not-allowed"
                              )}
                              title="Synchronize Campaign"
                              onClick={() => handleSyncCampaign(camp.id, camp.name)}
                            >
                              <RefreshCw className={cn("size-4", isSyncing && "text-blue-500")} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                              title="Delete"
                              onClick={() => handleDeleteCampaign(camp.id, camp.name)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-zinc-500 dark:text-zinc-400 text-sm">
                      No campaigns found matching the filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          /* Desktop/Tablet CARD VIEW (responsive grids) */
          <div className="p-4 sm:p-5">
            {filteredCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCampaigns.map((camp) => {
                  const isSyncing = syncingId === camp.id;
                  return (
                    <div
                      key={camp.id}
                      className="rounded-xl border border-zinc-200 bg-white p-4 space-y-4 shadow-xs hover:shadow-md transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        {/* Platform & Status Headers */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 border",
                            camp.platform === "Meta Ads" && "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30",
                            camp.platform === "Google Ads" && "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30",
                            camp.platform === "TikTok Ads" && "bg-zinc-100 text-zinc-900 border-zinc-200/50 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
                          )}>
                            {camp.platform}
                          </span>
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                            camp.status === "Active" && "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
                            camp.status === "Paused" && "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
                            camp.status === "Completed" && "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
                          )}>
                            <span className={cn(
                              "size-1.5 rounded-full",
                              camp.status === "Active" && "bg-emerald-500",
                              camp.status === "Paused" && "bg-amber-500",
                              camp.status === "Completed" && "bg-blue-500"
                            )} />
                            {camp.status}
                          </span>
                        </div>

                        {/* Name & Client Info */}
                        <div className="space-y-1">
                          <Link
                            href={`/dashboard/campaigns/${camp.id}`}
                            className="font-bold text-zinc-900 dark:text-zinc-100 text-sm hover:text-zinc-700 dark:hover:text-zinc-300 hover:underline transition-all block truncate"
                          >
                            {camp.name}
                          </Link>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                            Client: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{camp.clientName}</span>
                          </p>
                        </div>

                        {/* Budget Details Sheet */}
                        <div className="grid grid-cols-3 gap-3 bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/40 text-xs">
                          <div>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Budget</p>
                            <p className="text-zinc-900 dark:text-zinc-100 font-bold mt-0.5 truncate">{formatLyd(camp.budget)}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Spent</p>
                            <p className="text-zinc-900 dark:text-zinc-100 font-bold mt-0.5 truncate">{formatLyd(camp.spent)}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-center">Leads</p>
                            <p className="text-zinc-900 dark:text-zinc-100 font-bold text-center mt-0.5">{camp.leads}</p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom row and Actions */}
                      <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                        <p className="text-[10px] text-zinc-400 flex items-center gap-1 font-medium">
                          <Clock className="size-3 shrink-0" />
                          Last Synced: {camp.lastSync}
                        </p>

                        <div className="flex items-center gap-2">
                          <Button
                            render={<Link href={`/dashboard/campaigns/${camp.id}`} />}
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg text-xs font-semibold px-3"
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isSyncing}
                            className={cn(
                              "h-8 rounded-lg text-xs font-semibold px-3",
                              isSyncing && "cursor-not-allowed opacity-75"
                            )}
                            onClick={() => handleSyncCampaign(camp.id, camp.name)}
                          >
                            <RefreshCw className={cn("size-3.5 mr-1", isSyncing && "animate-spin text-blue-500")} />
                            {isSyncing ? "Syncing..." : "Sync"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
              })}
              </div>
            ) : (
              <div className="col-span-full text-center py-12 text-zinc-500 dark:text-zinc-400 text-sm">
                No campaigns found matching the filters.
              </div>
            )}
          </div>
        )}

        {/* Mobile Campaign Cards (always shown on mobile, hidden on tablet/desktop) */}
        <div className="md:hidden divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((camp) => {
              const isSyncing = syncingId === camp.id;
              return (
                <div key={camp.id} className="p-4 space-y-4 animate-in fade-in duration-200">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/dashboard/campaigns/${camp.id}`}
                        className="font-bold text-zinc-900 dark:text-zinc-100 text-sm hover:underline hover:text-zinc-700 dark:hover:text-zinc-300 block"
                      >
                        {camp.name}
                      </Link>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Client: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{camp.clientName}</span>
                      </p>
                    </div>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border",
                      camp.status === "Active" && "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
                      camp.status === "Paused" && "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
                      camp.status === "Completed" && "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
                    )}>
                      {camp.status}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-3 gap-2 text-xs bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400 font-medium">Platform</p>
                      <p className="text-zinc-900 dark:text-zinc-100 font-semibold truncate mt-0.5">
                        {camp.platform}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400 font-medium">Budget</p>
                      <p className="text-zinc-900 dark:text-zinc-100 font-semibold mt-0.5">
                        {formatLyd(camp.budget)}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400 font-medium text-center">Leads</p>
                      <p className="text-zinc-900 dark:text-zinc-100 font-bold text-center mt-0.5">
                        {camp.leads}
                      </p>
                    </div>
                  </div>

                  {/* Sync date on mobile */}
                  <p className="text-[10px] text-zinc-400 flex items-center gap-1 font-medium">
                    <Clock className="size-3 shrink-0" />
                    Last Synced: {camp.lastSync}
                  </p>

                  {/* Actions Row */}
                  <div className="flex items-center justify-end gap-2 pt-1.5">
                    <Button
                      render={<Link href={`/dashboard/campaigns/${camp.id}`} />}
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg text-xs font-semibold px-3"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isSyncing}
                      className={cn(
                        "h-8 rounded-lg text-xs font-semibold px-3 flex items-center gap-1",
                        isSyncing && "cursor-not-allowed opacity-70"
                      )}
                      onClick={() => handleSyncCampaign(camp.id, camp.name)}
                    >
                      <RefreshCw className={cn("size-3.5", isSyncing && "animate-spin text-blue-500")} />
                      {isSyncing ? "Syncing..." : "Sync"}
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-zinc-500 dark:text-zinc-400 text-sm">
              No campaigns found matching the filters.
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
