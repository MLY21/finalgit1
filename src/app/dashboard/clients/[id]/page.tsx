"use client";

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
  Plus,
  Edit,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
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
import { Progress } from "@/components/ui/progress";
import { PerformanceBar } from "@/components/dashboard/performance-bar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ClientStatusBadge } from "@/components/dashboard/clients/client-status-badge";
import { ClientPerformanceChart } from "@/components/dashboard/clients/client-performance-chart";
import {
  mockClients,
  mockClientCampaigns,
  mockClientPerformance,
  mockClientActivities,
} from "@/data/clients";
import { formatLyd, formatDate } from "@/lib/format";

const platformLabels = {
  meta: "Meta Ads",
  tiktok: "TikTok Ads",
  google: "Google Ads",
};

export default function ClientDetailsPage() {
  const params = useNextParams();
  const id = params.id as string;

  const client = mockClients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <p className="text-zinc-500 dark:text-zinc-400">Client not found.</p>
        <Button
          render={<Link href="/dashboard/clients" />}
          variant="outline"
          className="h-9 rounded-lg"
        >
          <ArrowLeft className="size-4 mr-1.5" />
          Back to Clients
        </Button>
      </div>
    );
  }

  const campaigns = mockClientCampaigns[id] || [];
  const performanceData = mockClientPerformance[id] || [];
  const activities = mockClientActivities.filter((a) => a.clientName === client.name);

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
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              onClick={() => alert(`Edit flow for client: ${client.name}`)}
              className="h-9 rounded-lg px-4 text-sm font-medium"
            >
              <Edit className="size-4 mr-1.5" />
              Edit Client
            </Button>
            <Button
              onClick={() => alert(`Add campaign flow for client: ${client.name}`)}
              className="h-9 rounded-lg px-4 text-sm font-medium"
            >
              <Plus className="size-4 mr-1.5" />
              Add Campaign
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
          title="Total Revenue"
          value={formatLyd(client.totalRevenue)}
          change="+22%"
          trend="up"
          icon={DollarSign}
          comparisonLabel="vs last month"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Performance Chart */}
        <div className="lg:col-span-2 space-y-6">
          <ClientPerformanceChart data={performanceData} />

          {/* Client Campaigns Table */}
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
                          <StatusBadge status={campaign.status} />
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
                              {activity.type === "completed" ? (
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
    </div>
  );
}
