import type { LucideIcon } from "lucide-react";

import type { Permission } from "@/types/auth";

export type CampaignStatus = "active" | "paused" | "completed";

export type AdPlatform = "meta" | "tiktok" | "google";

export type StatKey =
  | "totalClients"
  | "activeCampaigns"
  | "totalLeads"
  | "totalExpenses";

export interface StatCardData {
  key: StatKey;
  value: number | string;
  change: number;
  trend: "up" | "down";
}

export interface Campaign {
  id: string;
  nameKey: string;
  platform: AdPlatform;
  budget: number;
  status: CampaignStatus;
  performance: number;
  date: string;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface NavigationItem {
  key: string;
  href: string;
  icon: LucideIcon;
  permission: Permission;
}

export interface DashboardOverview {
  stats: StatCardData[];
  campaignPerformance: ChartDataPoint[];
  monthlyExpenses: ChartDataPoint[];
  recentCampaigns: Campaign[];
}
