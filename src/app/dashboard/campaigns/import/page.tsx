"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Import, CheckCircle2, AlertCircle, RefreshCw, Search,
  Link2, Link2Off, Database, SquareMousePointer,
} from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ClientOption {
  id:      string;
  name:    string;
  company: string;
}

interface SocialPageOption {
  id:            string;
  name:          string;
  externalPageId: string | null;
  clientId:      string | null;
}

interface Candidate {
  id:                 string;
  externalCampaignId: string;
  name:               string;
  fbStatus:           string;
  fbObjective:        string;
  dailyBudget:        string | null;
  lifetimeBudget:     string | null;
  startTime:          string | null;
  stopTime:           string | null;
  fbPageId:           string | null;
  socialPageId:       string | null;
  socialPageName:     string | null;
  clientId:           string | null;
  clientName:         string | null;
  hasInsights:        boolean;
  fetchedAt:          string;
}

interface FetchResult {
  campaignsFetched:       number;
  insightsFetched:        number;
  adsetsFetched:          number;
  campaignsLinkedToPages: number;
  campaignsWithoutPage:   number;
  candidatesUpserted:     number;
  message:                string;
}

interface ImportResult {
  campaignsSelected:      number;
  campaignsImported:      number;
  campaignsLinkedToPages: number;
  campaignsWithoutPage:   number;
  performancesSaved:      number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  PAUSED:   "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  ARCHIVED: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

function fmtBudget(c: Candidate): string {
  const raw = c.lifetimeBudget ?? c.dailyBudget;
  if (!raw) return "—";
  const val = parseFloat(raw) / 100;
  return isNaN(val) ? "—" : `${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
}

function fmtDate(s: string | null): string {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ImportCampaignsPage() {
  const [candidates, setCandidates]           = useState<Candidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);

  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchResult, setFetchResult]   = useState<FetchResult | null>(null);
  const [fetchError, setFetchError]     = useState<string | null>(null);

  const [clients, setClients]         = useState<ClientOption[]>([]);
  const [socialPages, setSocialPages] = useState<SocialPageOption[]>([]);

  const [selected, setSelected]           = useState<Set<string>>(new Set());
  const [search, setSearch]               = useState("");
  const [filterStatus, setFilterStatus]   = useState("all");
  const [filterPageMatch, setFilterPageMatch] = useState<"all" | "linked" | "unlinked">("all");
  const [filterClientId, setFilterClientId]   = useState("all");
  const [filterSocialPageId, setFilterSocialPageId] = useState("all");

  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult]   = useState<ImportResult | null>(null);
  const [importError, setImportError]     = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((d) => { if (d.success) setClients(d.data); });
    fetch("/api/social-pages")
      .then((r) => r.json())
      .then((d) => { if (d.success) setSocialPages(d.data); });
  }, []);

  const availablePages = useMemo(() => {
    if (filterClientId === "all") return socialPages;
    return socialPages.filter((p) => p.clientId === filterClientId);
  }, [socialPages, filterClientId]);

  const handleClientChange = (id: string) => {
    setFilterClientId(id);
    setFilterSocialPageId("all");
  };

  const loadCandidates = useCallback(async () => {
    setLoadingCandidates(true);
    try {
      const res  = await fetch("/api/facebook/candidates");
      const data = await res.json();
      if (data.success) setCandidates(data.data);
    } finally {
      setLoadingCandidates(false);
    }
  }, []);

  useEffect(() => { loadCandidates(); }, [loadCandidates]);

  const handleFetch = async () => {
    setFetchLoading(true);
    setFetchResult(null);
    setFetchError(null);
    try {
      const res  = await fetch("/api/campaigns/sync-facebook", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFetchError(data.message ?? "Fetch failed.");
      } else {
        setFetchResult(data.data ?? data);
        await loadCandidates();
      }
    } catch {
      setFetchError("Something went wrong. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImport = async () => {
    if (selected.size === 0) return;
    setImportLoading(true);
    setImportResult(null);
    setImportError(null);
    try {
      const res  = await fetch("/api/facebook/import", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ externalCampaignIds: [...selected] }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setImportError(data.message ?? "Import failed.");
      } else {
        setImportResult(data.data);
        setSelected(new Set());
      }
    } catch {
      setImportError("Something went wrong.");
    } finally {
      setImportLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return candidates
      .filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.clientName ?? "").toLowerCase().includes(search.toLowerCase()))
      .filter((c) => filterStatus === "all" ? true : c.fbStatus.toUpperCase() === filterStatus)
      .filter((c) => filterPageMatch === "linked" ? !!c.socialPageId : filterPageMatch === "unlinked" ? !c.socialPageId : true)
      .filter((c) => filterClientId === "all" ? true : c.clientId === filterClientId)
      .filter((c) => filterSocialPageId === "all" ? true : c.socialPageId === filterSocialPageId);
  }, [candidates, search, filterStatus, filterPageMatch, filterClientId, filterSocialPageId]);

  const filteredIds    = filtered.map((c) => c.externalCampaignId);
  const allSelected    = filteredIds.length > 0 && filteredIds.every((id) => selected.has(id));
  const someSelected   = filteredIds.some((id) => selected.has(id));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) filteredIds.forEach((id) => next.delete(id));
      else filteredIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectClass = "h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 cursor-pointer w-full transition-colors";
  const fieldLabel  = "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5";

  const statMatched   = candidates.filter((c) => !!c.socialPageId).length;
  const statUnmatched = candidates.filter((c) => !c.socialPageId).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Import Campaigns"
          description="Sync campaigns from Facebook, assign them to clients and pages, then import your selection."
        />
        <Button
          variant="outline"
          onClick={handleFetch}
          disabled={fetchLoading}
          className="h-10 rounded-lg px-4 text-sm font-semibold flex items-center gap-2 shrink-0"
        >
          <RefreshCw className={`size-4 ${fetchLoading ? "animate-spin" : ""}`} />
          {fetchLoading ? "Fetching..." : "Fetch Facebook"}
        </Button>
      </div>

      {/* Notification banners */}
      {fetchResult && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/20 animate-in fade-in duration-200">
          <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-medium text-emerald-800 dark:text-emerald-300">
            <span><strong>{fetchResult.campaignsFetched}</strong> campaigns fetched</span>
            <span><strong>{fetchResult.adsetsFetched}</strong> adsets</span>
            <span><strong>{fetchResult.insightsFetched}</strong> insights</span>
            <span><strong>{fetchResult.campaignsLinkedToPages}</strong> linked to pages</span>
            <span><strong>{fetchResult.campaignsWithoutPage}</strong> without page</span>
          </div>
        </div>
      )}
      {fetchError && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/40 dark:bg-rose-950/20">
          <AlertCircle className="size-5 shrink-0 text-rose-500" />
          <span className="text-sm font-medium text-rose-800 dark:text-rose-300">{fetchError}</span>
        </div>
      )}
      {importResult && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 dark:border-blue-900/40 dark:bg-blue-950/20 animate-in fade-in duration-200">
          <CheckCircle2 className="size-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-medium text-blue-800 dark:text-blue-300">
            <span><strong>{importResult.campaignsImported}</strong> campaigns imported</span>
            <span><strong>{importResult.campaignsLinkedToPages}</strong> linked to pages</span>
            <span><strong>{importResult.campaignsWithoutPage}</strong> without page</span>
            <span><strong>{importResult.performancesSaved}</strong> performance records saved</span>
          </div>
        </div>
      )}
      {importError && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/40 dark:bg-rose-950/20">
          <AlertCircle className="size-5 shrink-0 text-rose-500" />
          <span className="text-sm font-medium text-rose-800 dark:text-rose-300">{importError}</span>
        </div>
      )}

      {/* ── Unified Control Bar ─────────────────────────────────────────── */}
      <DashboardCard className="p-5 sm:p-6">
        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input
            placeholder="Search by campaign or client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-lg text-sm w-full"
          />
        </div>

        {/* Filters + Actions */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 flex-1">
            <div className="flex-1 min-w-[140px]">
              <label className={fieldLabel}>Client</label>
              <select value={filterClientId} onChange={(e) => handleClientChange(e.target.value)} className={selectClass}>
                <option value="all">All Clients</option>
                {clients.map((cl) => (
                  <option key={cl.id} value={cl.id}>{cl.name}{cl.company ? ` — ${cl.company}` : ""}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className={fieldLabel}>Facebook Page</label>
              <select value={filterSocialPageId} onChange={(e) => setFilterSocialPageId(e.target.value)} className={selectClass}>
                <option value="all">{filterClientId === "all" ? "All Pages" : "All pages for this client"}</option>
                {availablePages.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[130px]">
              <label className={fieldLabel}>Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectClass}>
                <option value="all">All</option>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div className="min-w-[150px]">
              <label className={fieldLabel}>Match</label>
              <select value={filterPageMatch} onChange={(e) => setFilterPageMatch(e.target.value as any)} className={selectClass}>
                <option value="all">All</option>
                <option value="linked">Linked</option>
                <option value="unlinked">Unlinked</option>
              </select>
            </div>
          </div>

          {/* Import action */}
          <div className="flex items-end shrink-0">
            <Button
              onClick={handleImport}
              disabled={selected.size === 0 || importLoading}
              className="h-10 rounded-lg px-5 text-sm font-semibold flex items-center gap-2"
            >
              <Import className="size-4" />
              {importLoading ? "Importing..." : `Import Selected${selected.size > 0 ? ` (${selected.size})` : ""}`}
            </Button>
          </div>
        </div>

        {/* Selected indicator */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {selected.size > 0 ? (
              <span className="text-blue-600 dark:text-blue-400">{selected.size} campaign{selected.size !== 1 ? "s" : ""} selected</span>
            ) : (
              "No campaigns selected"
            )}
          </span>
          {(filterClientId !== "all" || filterSocialPageId !== "all" || filterStatus !== "all" || filterPageMatch !== "all" || search) && (
            <button
              onClick={() => { setFilterClientId("all"); setFilterSocialPageId("all"); setFilterStatus("all"); setFilterPageMatch("all"); setSearch(""); }}
              className="text-xs font-medium text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline underline-offset-2"
            >
              Clear all filters
            </button>
          )}
        </div>
      </DashboardCard>

      {/* ── Candidates Table ────────────────────────────────────────────────────────── */}
      <DashboardCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-200 hover:bg-transparent dark:border-zinc-800">
                <TableHead className="w-10 ps-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-zinc-300 accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
                  />
                </TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 min-w-[200px]">Campaign Name</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400">Objective</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400">Budget</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400">Start</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400">End</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400">FB Page</TableHead>
                <TableHead className="pe-5 text-zinc-500 dark:text-zinc-400">Client</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingCandidates ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-16 text-sm text-zinc-400">
                    Loading candidates...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <Database className="size-8 text-zinc-300 dark:text-zinc-600" />
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {candidates.length === 0
                          ? 'No candidates yet — click "Fetch from Facebook" to load campaigns.'
                          : (filterClientId !== "all" || filterSocialPageId !== "all")
                            ? "No campaigns available for this client/page."
                            : "No campaigns match the current filters."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow
                    key={c.externalCampaignId}
                    className={`border-zinc-200 dark:border-zinc-800 cursor-pointer transition-colors ${
                      selected.has(c.externalCampaignId) ? "bg-blue-50/60 dark:bg-blue-950/10" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                    }`}
                    onClick={() => toggle(c.externalCampaignId)}
                  >
                    <TableCell className="ps-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(c.externalCampaignId)}
                        onChange={() => toggle(c.externalCampaignId)}
                        className="h-4 w-4 rounded border-zinc-300 accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-100 text-sm max-w-xs">
                      <div className="truncate" title={c.name}>{c.name}</div>
                      <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{c.externalCampaignId}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[c.fbStatus] ?? "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                        {c.fbStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-zinc-500 dark:text-zinc-400">
                      {c.fbObjective.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                      {fmtBudget(c)}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-500 dark:text-zinc-400">{fmtDate(c.startTime)}</TableCell>
                    <TableCell className="text-xs text-zinc-500 dark:text-zinc-400">{fmtDate(c.stopTime)}</TableCell>
                    <TableCell>
                      {c.socialPageName ? (
                        <div className="flex items-center gap-1.5">
                          <Link2 className="size-3.5 text-emerald-500 shrink-0" />
                          <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[140px]" title={c.socialPageName}>
                            {c.socialPageName}
                          </span>
                        </div>
                      ) : c.fbPageId ? (
                        <div className="flex items-center gap-1.5">
                          <Link2Off className="size-3.5 text-amber-500 shrink-0" />
                          <span className="text-[10px] font-mono text-zinc-400">{c.fbPageId}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="pe-5">
                      {c.clientName ? (
                        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{c.clientName}</span>
                      ) : (
                        <span className="text-xs text-zinc-400">Unlinked</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!loadingCandidates && candidates.length > 0 && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 px-5 py-3 flex items-center justify-between text-xs text-zinc-400">
            <span>Showing <strong className="text-zinc-600 dark:text-zinc-300">{filtered.length}</strong> of <strong className="text-zinc-600 dark:text-zinc-300">{candidates.length}</strong> candidates</span>
            {selected.size > 0 && (
              <button onClick={() => setSelected(new Set())} className="font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline underline-offset-2">
                Clear selection
              </button>
            )}
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
