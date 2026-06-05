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
  List
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockClients, Client } from "@/data/clients";
import { formatLyd } from "@/lib/format";
import { ClientStatusBadge } from "@/components/dashboard/clients/client-status-badge";
import { cn } from "@/lib/utils";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "pending">("all");
  const [viewMode, setViewMode] = useState<"list" | "card">("card");

  const handleDeleteClient = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete client "${name}"?`)) {
      setClients(clients.filter((client) => client.id !== id));
      alert(`Client "${name}" has been deleted.`);
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

      {/* Main Container containing Action Bar and Content */}
      <DashboardCard className="overflow-hidden">
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
                              onClick={() => alert(`Edit flow for client: ${client.name}`)}
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                              title="Delete"
                              onClick={() => handleDeleteClient(client.id, client.name)}
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
                          onClick={() => alert(`Edit flow for client: ${client.name}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg text-xs font-semibold px-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          onClick={() => handleDeleteClient(client.id, client.name)}
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
      </DashboardCard>
    </div>
  );
}
