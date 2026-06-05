import type { AdPlatform, CampaignStatus } from "@/types";

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: "client";
  accountStatus: "active" | "suspended";
  createdAt: string;
  avatarInitials: string;
}

export type ClientStatKey =
  | "myCampaigns"
  | "activeCampaigns"
  | "totalBudget"
  | "totalSpent"
  | "remainingBudget"
  | "totalLeads";

export interface ClientStat {
  key: ClientStatKey;
  value: number;
  description: string;
  format: "currency" | "number";
}

export interface PerformancePoint {
  name: string;
  views: number;
  clicks: number;
  leads: number;
}

export interface ClientExpense {
  id: string;
  title: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface CampaignNote {
  id: string;
  author: string;
  date: string;
  message: string;
}

export interface ClientCampaign {
  id: string;
  name: string;
  platform: AdPlatform;
  goal: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  performance: number;
  views: number;
  clicks: number;
  leads: number;
  conversions: number;
  revenue: number;
  performanceSeries: PerformancePoint[];
  expenses: ClientExpense[];
  notes: CampaignNote[];
}

export interface BudgetUsage {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
}

export interface ReportsSummary {
  totalViews: number;
  totalClicks: number;
  totalLeads: number;
  totalSpent: number;
  totalRevenue: number;
  netProfit: number;
}

export interface RevenueExpensePoint {
  name: string;
  revenue: number;
  expenses: number;
}

export interface LeadsByPlatformPoint {
  name: string;
  leads: number;
}

export interface ReportsData {
  summary: ReportsSummary;
  performance: PerformancePoint[];
  revenueVsExpenses: RevenueExpensePoint[];
  leadsByPlatform: LeadsByPlatformPoint[];
  bestPerforming: ClientCampaign[];
}
