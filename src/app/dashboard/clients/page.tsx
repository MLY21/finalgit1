"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  LayoutGrid,
  List,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  businessType: string;
  status: string;
  notes?: string;
  avatarInitials?: string;
  createdAt?: string;
  campaignsCount: number;
  totalBudget: number;
  totalRevenue: number;
}
import { formatLyd } from "@/lib/format";
import { ClientStatusBadge } from "@/components/dashboard/clients/client-status-badge";
import { cn } from "@/lib/utils";

const BUSINESS_TYPES = ["E-commerce", "Restaurant", "Clinic", "Education", "Real Estate", "Other"];
const STATUS_OPTIONS = ["active", "inactive", "pending", "suspended"];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "pending">("all");
  const [viewMode, setViewMode] = useState<"list" | "card">("card");

  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editTarget, setEditTarget] = useState<Client | null>(null);
  const [editForm, setEditForm] = useState({ name: "", company: "", email: "", phone: "", businessType: "", status: "", notes: "" });
  const [editLoading, setEditLoading] = useState(false);

  const loadClients = () => {
    setIsLoading(true);
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => { if (data.success) setClients(data.data); })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { loadClients(); }, []);

  const openEdit = (client: Client) => {
    setEditTarget(client);
    setEditForm({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      businessType: client.businessType,
      status: client.status,
      notes: client.notes ?? "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editTarget) return;
    setEditLoading(true);
    try {
      const res = await fetch(`/api/clients/${editTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.message ?? "Failed to update client."); return; }
      setEditTarget(null);
      loadClients();
      showToast("success", "Client updated successfully.");
    } catch {
      showToast("error", "Something went wrong.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/clients/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.message ?? "Failed to delete client."); return; }
      setDeleteTarget(null);
      setClients((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast("success", "Client deleted successfully.");
    } catch {
      showToast("error", "Something went wrong.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Clients"
          description="Manage and monitor client accounts and campaign relationships."
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

          {/* Add Client Button */}
          <Button
            render={<Link href="/dashboard/clients/new" />}
            className="h-10 rounded-lg px-4 text-sm font-medium shrink-0 animate-in fade-in"
          >
            <Plus className="size-4 mr-1.5" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-sm text-zinc-500 dark:text-zinc-400">
          Loading clients...
        </div>
      )}

      {/* Main Container containing Action Bar and Content */}
      {!isLoading && <DashboardCard className="overflow-hidden">
        {/* Action Bar */}
        <div className="flex flex-col gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800 sm:flex-row sm:items-center sm:p-5">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="search"
              placeholder="Search clients by name, company, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-lg border-zinc-200 bg-zinc-50 ps-10 text-sm dark:border-zinc-800 dark:bg-zinc-900 w-full"
            />
          </div>

          {/* Status Filter Selector */}
          <div className="w-full sm:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-600 transition-colors w-full cursor-pointer font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Content Area rendering List (Table) or Cards based on viewMode */}
        {viewMode === "list" ? (
          /* Desktop/Tablet Table view */
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-200 hover:bg-transparent dark:border-zinc-800">
                  <TableHead className="ps-5 text-zinc-500 dark:text-zinc-400 sm:ps-6">
                    Client
                  </TableHead>
                  <TableHead className="text-zinc-500 dark:text-zinc-400">
                    Company
                  </TableHead>
                  <TableHead className="text-zinc-500 dark:text-zinc-400">
                    Email
                  </TableHead>
                  <TableHead className="text-zinc-500 dark:text-zinc-400">
                    Phone
                  </TableHead>
                  <TableHead className="text-zinc-500 dark:text-zinc-400 text-center">
                    Campaigns
                  </TableHead>
                  <TableHead className="text-zinc-500 dark:text-zinc-400">
                    Total Budget
                  </TableHead>
                  <TableHead className="text-zinc-500 dark:text-zinc-400">
                    Status
                  </TableHead>
                  <TableHead className="pe-5 text-zinc-500 dark:text-zinc-400 text-end sm:pe-6 w-[220px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => {
                    const initials = client.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2);

                    return (
                      <TableRow
                        key={client.id}
                        className="border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                      >
                        <TableCell className="ps-5 sm:ps-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8 rounded-lg border border-zinc-200 dark:border-zinc-700">
                              <AvatarFallback className="rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <Link
                              href={`/dashboard/clients/${client.id}`}
                              className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm hover:text-zinc-700 dark:hover:text-zinc-300 hover:underline transition-all cursor-pointer"
                            >
                              {client.name}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="size-3.5 text-zinc-400" />
                            {client.company}
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm">
                          {client.email}
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm">
                          {client.phone}
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm text-center">
                          {client.campaignsCount}
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                          {formatLyd(client.totalBudget)}
                        </TableCell>
                        <TableCell>
                          <ClientStatusBadge status={client.status} />
                        </TableCell>
                        <TableCell className="pe-5 text-end sm:pe-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              render={<Link href={`/dashboard/clients/${client.id}`} />}
                              variant="ghost"
                              size="sm"
                              className="h-8 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 px-2.5"
                            >
                              View Profile
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                              title="Edit"
                              onClick={() => openEdit(client)}
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                              title="Delete"
                              onClick={() => setDeleteTarget({ id: client.id, name: client.name })}
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
                    <TableCell colSpan={8} className="text-center py-10 text-zinc-500 dark:text-zinc-400 text-sm">
                      No clients found matching the filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          /* Cards Grid View (responsive layout, grid on larger screens, list on mobile) */
          <div className="p-4 sm:p-5">
            {filteredClients.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredClients.map((client) => {
                  const initials = client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2);

                  return (
                    <div 
                      key={client.id} 
                      className="rounded-xl border border-zinc-200 bg-white p-4 space-y-4 shadow-xs hover:shadow-md transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        {/* Card Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10 rounded-lg border border-zinc-200 dark:border-zinc-700">
                              <AvatarFallback className="rounded-lg bg-zinc-100 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <Link
                                href={`/dashboard/clients/${client.id}`}
                                className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm hover:text-zinc-700 dark:hover:text-zinc-300 hover:underline transition-all cursor-pointer block leading-tight"
                              >
                                {client.name}
                              </Link>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 flex items-center gap-1">
                                <Building2 className="size-3 text-zinc-400" />
                                {client.company}
                              </p>
                            </div>
                          </div>
                          <ClientStatusBadge status={client.status} />
                        </div>

                        {/* Card Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/30">
                          <div className="space-y-0.5">
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Email</p>
                            <p className="text-zinc-900 dark:text-zinc-100 truncate" title={client.email}>
                              {client.email}
                            </p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Phone</p>
                            <p className="text-zinc-900 dark:text-zinc-100">
                              {client.phone}
                            </p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Campaigns</p>
                            <p className="text-zinc-900 dark:text-zinc-100 font-semibold">
                              {client.campaignsCount}
                            </p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Total Budget</p>
                            <p className="text-zinc-900 dark:text-zinc-100 font-semibold">
                              {formatLyd(client.totalBudget)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/50 mt-1">
                        <Button
                          render={<Link href={`/dashboard/clients/${client.id}`} />}
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg text-xs font-semibold px-3"
                        >
                          View Profile
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg text-xs font-semibold px-3"
                          onClick={() => openEdit(client)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg text-xs font-semibold px-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          onClick={() => setDeleteTarget({ id: client.id, name: client.name })}
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 text-sm">
                No clients found matching the filters.
              </div>
            )}
          </div>
        )}
      </DashboardCard>}

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2 duration-200 ${
          toast.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/80 dark:text-emerald-300"
            : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/80 dark:text-rose-300"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Delete Client</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Are you sure you want to delete <span className="font-semibold text-zinc-900 dark:text-zinc-100">{deleteTarget.name}</span>? This action cannot be undone.
                </p>
              </div>
              <button onClick={() => setDeleteTarget(null)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 ml-4">
                <X className="size-4" />
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" className="h-9 rounded-lg text-sm" onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>Cancel</Button>
              <Button className="h-9 rounded-lg text-sm bg-rose-600 hover:bg-rose-700 text-white" onClick={handleDeleteClient} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Edit Client</h2>
              <button onClick={() => setEditTarget(null)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"><X className="size-4" /></button>
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
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Notes</span>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none resize-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 px-6 py-4">
              <Button variant="outline" className="h-9 rounded-lg text-sm" onClick={() => setEditTarget(null)} disabled={editLoading}>Cancel</Button>
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
