"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams as useNextParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Briefcase,
  TrendingUp,
  Coins,
  DollarSign,
  Edit,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  LayoutList,
} from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PerformanceBar } from "@/components/dashboard/performance-bar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ClientStatusBadge } from "@/components/dashboard/clients/client-status-badge";
import { ClientPerformanceChart } from "@/components/dashboard/clients/client-performance-chart";
import { Input } from "@/components/ui/input";
import { formatLyd, formatDate } from "@/lib/format";

const BUSINESS_TYPES = ["E-commerce", "Restaurant", "Clinic", "Education", "Real Estate", "Other"];
const STATUS_OPTIONS = ["active", "inactive", "pending", "suspended"];

const platformLabels: Record<string, string> = {
  meta: "Meta Ads",
  tiktok: "TikTok Ads",
  google: "Google Ads",
};

interface ClientDetail {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  businessType: string;
  status: string;
  notes: string;
  avatarInitials?: string;
  createdAt: string;
  totalBudget: number;
  totalSpend: number;
  campaignsCount: number;
  campaigns: Array<{
    id: string;
    name: string;
    platform: string;
    status: string;
    budget: number;
    spent: number;
    performance: number;
    date: string;
    performanceSeries: Array<{ date: string; clicks: number; impressions: number; spend: number }>;
  }>;
  activityLogs: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
  facebookPage: { id: string; name: string; externalPageId: string | null } | null;
}

export default function ClientDetailsPage() {
  const params = useNextParams();
  const id = params.id as string;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const campaignsRef = useRef<HTMLDivElement>(null);

  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", company: "", email: "", phone: "", businessType: "", status: "", notes: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [unlinkedPages, setUnlinkedPages] = useState<{ id: string; name: string; externalPageId: string | null }[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  const openEdit = () => {
    if (!client) return;
    setEditForm({ name: client.name, company: client.company, email: client.email, phone: client.phone, businessType: client.businessType, status: client.status, notes: client.notes });
    setSelectedPageId(undefined as any);
    setEditError(null);
    setShowEdit(true);
    fetch("/api/social-pages/unlinked")
      .then((r) => r.json())
      .then((d) => { if (d.success) setUnlinkedPages(d.data); });
  };

  const handleSaveEdit = async () => {
    if (!client) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const payload: any = { ...editForm };
      if (selectedPageId !== undefined) payload.socialPageId = selectedPageId ?? "";
      const res = await fetch(`/api/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setEditError(data.message ?? "Failed to update."); return; }
      setClient((prev) => prev ? { ...prev, ...editForm } : prev);
      setShowEdit(false);
      fetch(`/api/clients/${id}`).then((r) => r.json()).then((d) => { if (d.success) setClient(d.data); });
    } catch {
      setEditError("Something went wrong.");
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    fetch(`/api/clients/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setClient(data.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-zinc-500 dark:text-zinc-400">
        Loading client...
      </div>
    );
  }

  if (notFound || !client) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <p className="text-zinc-500 dark:text-zinc-400">Client not found.</p>
        <Button render={<Link href="/dashboard/clients" />} variant="outline" className="h-9 rounded-lg">
          <ArrowLeft className="size-4 mr-1.5" />
          Back to Clients
        </Button>
      </div>
    );
  }

  const campaigns = client.campaigns;
  const performanceData = campaigns.flatMap((c) =>
    c.performanceSeries.map((p) => ({
      date: p.date,
      name: p.date,
      views: p.impressions,
      clicks: p.clicks,
      leads: 0,
    }))
  );
  const activities = client.activityLogs;
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Back Button and Breadcrumb */}
      <div className="flex items-center gap-2">
        <Button
          render={<Link href="/dashboard/clients" />}
          variant="ghost"
          size="sm"
          className="h-8 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="size-4 mr-1.5" />
          Back to Clients
        </Button>
      </div>

      {/* Client Header Section */}
      <DashboardCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {client.name}
              </h1>
              <ClientStatusBadge status={client.status} />
              <Badge variant="secondary" className="rounded-lg text-xs font-medium">
                {client.businessType}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-y-2 gap-x-6 text-sm text-zinc-600 dark:text-zinc-400 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-zinc-400 shrink-0" />
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{client.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-zinc-400 shrink-0" />
                <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-zinc-400 shrink-0" />
                <a href={`tel:${client.phone}`} className="hover:underline">{client.phone}</a>
              </div>
              {client.facebookPage ? (
                <div className="flex items-center gap-2 sm:col-span-3">
                  <svg className="size-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{client.facebookPage.name}</span>
                  {client.facebookPage.externalPageId && (
                    <span className="text-xs text-zinc-400 font-mono">({client.facebookPage.externalPageId})</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:col-span-3">
                  <svg className="size-4 text-zinc-300 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  <span className="text-zinc-400 text-xs">No Facebook Page linked</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              onClick={openEdit}
              className="h-9 rounded-lg px-4 text-sm font-medium"
            >
              <Edit className="size-4 mr-1.5" />
              Edit Client
            </Button>
            <Button
              onClick={() => campaignsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="h-9 rounded-lg px-4 text-sm font-medium"
            >
              <LayoutList className="size-4 mr-1.5" />
              View Campaigns
            </Button>
          </div>
        </div>
      </DashboardCard>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Campaigns"
          value={campaigns.length.toString()}
          change="+1"
          trend="up"
          icon={Briefcase}
          comparisonLabel="vs last month"
        />
        <StatCard
          title="Active Campaigns"
          value={activeCampaigns.toString()}
          change="0"
          trend="up"
          icon={TrendingUp}
          comparisonLabel="vs last month"
        />
        <StatCard
          title="Total Budget"
          value={formatLyd(client.totalBudget)}
          change="+8%"
          trend="up"
          icon={Coins}
          comparisonLabel="vs last month"
        />
        <StatCard
          title="Total Spend"
          value={formatLyd(client.totalSpend)}
          change=""
          trend="up"
          icon={DollarSign}
          comparisonLabel="accumulated"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Performance Chart */}
        <div className="lg:col-span-2 space-y-6">
          <ClientPerformanceChart data={performanceData} />

          {/* Client Campaigns Table */}
          <div ref={campaignsRef}>
          <DashboardCard className="overflow-hidden">
            <div className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-6">
              <SectionHeader
                title="Client Campaigns"
                description={`Advertising campaigns managed for ${client.company}.`}
              />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 hover:bg-transparent dark:border-zinc-800">
                    <TableHead className="ps-5 text-zinc-500 dark:text-zinc-400 sm:ps-6">
                      Campaign Name
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
                    <TableHead className="text-zinc-500 dark:text-zinc-400">
                      Spent
                    </TableHead>
                    <TableHead className="text-zinc-500 dark:text-zinc-400">
                      Performance
                    </TableHead>
                    <TableHead className="pe-5 text-zinc-500 dark:text-zinc-400 sm:pe-6">
                      Launch Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                      <TableRow
                        key={campaign.id}
                        className="border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                      >
                        <TableCell className="ps-5 font-semibold text-zinc-900 dark:text-zinc-100 sm:ps-6 text-sm">
                          {campaign.name}
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm">
                          {platformLabels[campaign.platform]}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={campaign.status as "active" | "paused" | "completed"} />
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                          {formatLyd(campaign.budget)}
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm">
                          {formatLyd(campaign.spent)}
                        </TableCell>
                        <TableCell>
                          <PerformanceBar value={campaign.performance} />
                        </TableCell>
                        <TableCell className="pe-5 text-zinc-600 dark:text-zinc-400 sm:pe-6 text-sm">
                          {formatDate(campaign.date)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-zinc-500 dark:text-zinc-400 text-sm">
                        No campaigns found for this client.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DashboardCard>
          </div>
        </div>

        {/* Sidebar details (Notes & Activity) */}
        <div className="space-y-6">
          {/* Client Notes */}
          <DashboardCard className="p-5 sm:p-6 space-y-4">
            <SectionHeader
              title="Client Notes"
              description="Internal details & preferences"
            />
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 min-h-[100px] leading-relaxed">
              {client.notes || "No notes available for this client."}
            </div>
          </DashboardCard>

          {/* Recent Client Activity */}
          <DashboardCard className="p-5 sm:p-6 space-y-4">
            <SectionHeader
              title="Recent Activity"
              description="Log of events for this account"
            />
            <div className="flow-root">
              <ul className="-mb-8">
                {activities.length > 0 ? (
                  activities.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== activities.length - 1 ? (
                          <span
                            className="absolute start-4 top-4 -ml-px h-full w-0.5 bg-zinc-200 dark:bg-zinc-800"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                              {activity.type.includes("COMPLETED") || activity.type.includes("CREATED") ? (
                                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Clock className="size-4 text-zinc-500" />
                              )}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                              {activity.description}
                            </p>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                              <Calendar className="size-3" />
                              <span>{formatDate(activity.timestamp.slice(0, 10))}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 py-4 text-center">
                    No recent activities recorded.
                  </p>
                )}
              </ul>
            </div>
          </DashboardCard>
        </div>
      </div>
      {/* ── Edit Modal ── */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Edit Client</h2>
              <button onClick={() => setShowEdit(false)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"><X className="size-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {([
                  { key: "name", label: "Full Name" },
                  { key: "company", label: "Company" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                ] as const).map(({ key, label }) => (
                  <label key={key} className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
                    <Input
                      value={editForm[key]}
                      onChange={(e) => setEditForm((p) => ({ ...p, [key]: e.target.value }))}
                      className="h-10 rounded-lg border-zinc-200 bg-zinc-50 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                    />
                  </label>
                ))}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Business Type</span>
                  <select
                    value={editForm.businessType}
                    onChange={(e) => setEditForm((p) => ({ ...p, businessType: e.target.value }))}
                    className="h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                  >
                    {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Status</span>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                    className="h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 capitalize"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} className="capitalize">{s}</option>)}
                  </select>
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Facebook Page</span>
                <select
                  value={selectedPageId ?? "__keep__"}
                  onChange={(e) => setSelectedPageId(e.target.value === "__keep__" ? undefined as any : e.target.value || null)}
                  className="h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 cursor-pointer"
                >
                  <option value="__keep__">— Keep current —</option>
                  <option value="">Unlink page</option>
                  {unlinkedPages.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}{p.externalPageId ? ` (${p.externalPageId})` : ""}</option>
                  ))}
                </select>
                {client?.facebookPage && (
                  <p className="text-xs text-zinc-400 mt-0.5">Current: {client.facebookPage.name}</p>
                )}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Notes</span>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none resize-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </label>
              {editError && <p className="text-xs text-rose-600 dark:text-rose-400">{editError}</p>}
            </div>
            <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 px-6 py-4">
              <Button variant="outline" className="h-9 rounded-lg text-sm" onClick={() => setShowEdit(false)} disabled={editLoading}>Cancel</Button>
              <Button className="h-9 rounded-lg text-sm" onClick={handleSaveEdit} disabled={editLoading}>
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
