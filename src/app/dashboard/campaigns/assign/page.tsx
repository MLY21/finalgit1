"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, UserCheck, X, CheckSquare, Square, Loader2, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Campaign {
  id: string;
  name: string;
  status: string;
  marketingGoal: string;
  platform: string;
  budget: number;
  startDate: string;
  endDate: string;
  assignmentStatus: "UNASSIGNED" | "MANUAL_ASSIGNED" | "AUTO_ASSIGNED";
  externalCampaignId: string | null;
  clientId: string | null;
  client: { id: string; name: string } | null;
}

interface Client {
  id: string;
  name: string;
  company: string;
}

const statusColor: Record<string, string> = {
  ACTIVE:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PAUSED:    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  COMPLETED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

const assignBadge: Record<string, string> = {
  UNASSIGNED:      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  MANUAL_ASSIGNED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  AUTO_ASSIGNED:   "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

const assignLabel: Record<string, string> = {
  UNASSIGNED:      "Unassigned",
  MANUAL_ASSIGNED: "Manual",
  AUTO_ASSIGNED:   "Auto",
};

export default function AssignCampaignsPage() {
  const [campaigns, setCampaigns]           = useState<Campaign[]>([]);
  const [clients, setClients]               = useState<Client[]>([]);
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [message, setMessage]               = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [selectedIds, setSelectedIds]       = useState<Set<string>>(new Set());
  const [targetClientId, setTargetClientId] = useState("");

  const [search, setSearch]                 = useState("");
  const [statusFilter, setStatusFilter]     = useState("");
  const [goalFilter, setGoalFilter]         = useState("");
  const [unassignedOnly, setUnassignedOnly] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, clRes] = await Promise.all([
        fetch("/api/admin/campaigns"),
        fetch("/api/clients"),
      ]);
      const cData  = await cRes.json();
      const clData = await clRes.json();
      if (cData.success)  setCampaigns(cData.data);
      if (clData.success) setClients(clData.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      if (unassignedOnly && c.assignmentStatus !== "UNASSIGNED") return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      if (goalFilter && c.marketingGoal !== goalFilter) return false;
      return true;
    });
  }, [campaigns, search, statusFilter, goalFilter, unassignedOnly]);

  const allSelected = filtered.length > 0 && filtered.every((c) => selectedIds.has(c.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((c) => next.delete(c.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((c) => next.add(c.id));
        return next;
      });
    }
  };

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAssign = async () => {
    if (!targetClientId) { setMessage({ type: "error", text: "Please select a target client." }); return; }
    if (selectedIds.size === 0) { setMessage({ type: "error", text: "Please select at least one campaign." }); return; }

    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/campaigns/assign", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: targetClientId, campaignIds: Array.from(selectedIds) }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setSelectedIds(new Set());
        await fetchData();
      } else {
        setMessage({ type: "error", text: data.message ?? "Assignment failed." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setSaving(false);
    }
  };

  const handleUnassign = async () => {
    if (selectedIds.size === 0) { setMessage({ type: "error", text: "Select campaigns to unassign." }); return; }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/campaigns/assign", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignIds: Array.from(selectedIds) }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setSelectedIds(new Set());
        await fetchData();
      } else {
        setMessage({ type: "error", text: data.message ?? "Failed." });
      }
    } finally {
      setSaving(false);
    }
  };

  const unassignedCount = campaigns.filter((c) => c.assignmentStatus === "UNASSIGNED").length;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Dashboard</Link>
          <span>/</span>
          <Link href="/dashboard/campaigns" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Campaigns</Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Assign to Clients</span>
        </div>
        <PageHeader
          title="Assign Campaigns to Clients"
          description="Manually assign Facebook campaigns to their corresponding clients."
        />
      </div>

      {/* Summary bar */}
      {!loading && (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50">
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
              {unassignedCount} Unassigned
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
              {campaigns.filter((c) => c.assignmentStatus === "MANUAL_ASSIGNED").length} Manual
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              {campaigns.length} Total
            </span>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`rounded-xl border px-4 py-3 text-sm flex items-center justify-between ${
          message.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400"
            : "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400"
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)}><X className="size-4" /></button>
        </div>
      )}

      {/* Controls */}
      <DashboardCard className="p-4 space-y-4">
        {/* Row 1: Assignment action */}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1 min-w-[220px] flex-1">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Target Client</label>
            <select
              value={targetClientId}
              onChange={(e) => setTargetClientId(e.target.value)}
              className="h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 cursor-pointer"
            >
              <option value="">-- Select client --</option>
              {clients.map((cl) => (
                <option key={cl.id} value={cl.id}>{cl.name} — {cl.company}</option>
              ))}
            </select>
          </div>

          <Button
            type="button"
            onClick={handleAssign}
            disabled={saving || selectedIds.size === 0 || !targetClientId}
            className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5"
          >
            {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <UserCheck className="size-4 mr-2" />}
            Assign Selected ({selectedIds.size})
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleUnassign}
            disabled={saving || selectedIds.size === 0}
            className="h-10 rounded-lg text-sm font-semibold px-4 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
          >
            <X className="size-4 mr-1.5" />
            Unassign
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={fetchData}
            disabled={loading}
            className="h-10 rounded-lg text-sm px-3"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Row 2: Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
            <Input
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 text-sm rounded-lg border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={goalFilter}
            onChange={(e) => setGoalFilter(e.target.value)}
            className="h-9 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 cursor-pointer"
          >
            <option value="">All Objectives</option>
            <option value="BRAND_AWARENESS">Brand Awareness</option>
            <option value="TRAFFIC">Traffic</option>
            <option value="ENGAGEMENT">Engagement</option>
            <option value="LEADS">Leads</option>
            <option value="SALES">Sales</option>
          </select>

          <label className="flex items-center gap-2 h-9 px-3 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={unassignedOnly}
              onChange={(e) => setUnassignedOnly(e.target.checked)}
              className="rounded"
            />
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Unassigned only</span>
          </label>
        </div>
      </DashboardCard>

      {/* Table */}
      <DashboardCard className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-zinc-400">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm">Loading campaigns...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-zinc-400">
            <span className="text-sm">No campaigns found.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-4 py-3 text-left w-10">
                    <button onClick={toggleAll} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                      {allSelected ? <CheckSquare className="size-4" /> : <Square className="size-4" />}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">Campaign</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">Objective</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">Assigned Client</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-500 dark:text-zinc-400">Assignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer ${
                      selectedIds.has(c.id) ? "bg-blue-50/50 dark:bg-blue-950/10" : ""
                    }`}
                    onClick={() => toggle(c.id)}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggle(c.id)} className="text-zinc-400 hover:text-blue-600">
                        {selectedIds.has(c.id)
                          ? <CheckSquare className="size-4 text-blue-600" />
                          : <Square className="size-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100 max-w-[320px] truncate">{c.name}</p>
                      {c.externalCampaignId && (
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">{c.externalCampaignId}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${statusColor[c.status] ?? ""}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-xs">
                      {c.marketingGoal.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3">
                      {c.client ? (
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{c.client.name}</span>
                      ) : (
                        <span className="text-zinc-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${assignBadge[c.assignmentStatus] ?? ""}`}>
                        {assignLabel[c.assignmentStatus]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400">
              Showing {filtered.length} of {campaigns.length} campaigns · {selectedIds.size} selected
            </div>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
