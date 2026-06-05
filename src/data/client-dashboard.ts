import type {
  BudgetUsage,
  ClientCampaign,
  ClientInfo,
  ClientStat,
  PerformancePoint,
  ReportsData,
} from "@/types/client";

export const clientInfo: ClientInfo = {
  name: "Ahmed Al-Mansour",
  email: "ahmed@brightmedia.ly",
  phone: "+218 91 234 5678",
  company: "Bright Media LY",
  role: "client",
  accountStatus: "active",
  createdAt: "2024-11-12",
  avatarInitials: "AM",
};

function buildSeries(base: number, growth: number): PerformancePoint[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  return months.map((name, index) => {
    const views = Math.round(base * (1 + growth * index));
    const clicks = Math.round(views * 0.06);
    const leads = Math.round(clicks * 0.18);
    return { name, views, clicks, leads };
  });
}

export const clientCampaigns: ClientCampaign[] = [
  {
    id: "cmp-1001",
    name: "Ramadan Brand Awareness",
    platform: "meta",
    goal: "Brand Awareness",
    status: "active",
    budget: 45000,
    spent: 31200,
    startDate: "2026-03-01",
    endDate: "2026-06-30",
    performance: 88,
    views: 482000,
    clicks: 28900,
    leads: 5210,
    conversions: 1340,
    revenue: 96500,
    performanceSeries: buildSeries(42000, 0.22),
    expenses: [
      { id: "exp-1", title: "Meta Ads Spend", amount: 24000, date: "2026-03-15", notes: "Reach & frequency buy" },
      { id: "exp-2", title: "Creative Production", amount: 4200, date: "2026-03-08", notes: "Video + static set" },
      { id: "exp-3", title: "Influencer Boost", amount: 3000, date: "2026-04-02" },
    ],
    notes: [
      { id: "n-1", author: "Marketing Team", date: "2026-04-10", message: "CPM dropped 14% after creative refresh. Scaling top ad set." },
      { id: "n-2", author: "Account Manager", date: "2026-03-22", message: "Audience overlap reduced. Performance trending up." },
    ],
  },
  {
    id: "cmp-1002",
    name: "Gen Z Product Launch",
    platform: "tiktok",
    goal: "Conversions",
    status: "active",
    budget: 32000,
    spent: 26750,
    startDate: "2026-04-05",
    endDate: "2026-07-15",
    performance: 92,
    views: 610000,
    clicks: 41200,
    leads: 6840,
    conversions: 1890,
    revenue: 132000,
    performanceSeries: buildSeries(58000, 0.18),
    expenses: [
      { id: "exp-4", title: "TikTok Ads Spend", amount: 21000, date: "2026-04-20", notes: "Spark ads" },
      { id: "exp-5", title: "Creator Partnership", amount: 4500, date: "2026-04-12" },
      { id: "exp-6", title: "Landing Page", amount: 1250, date: "2026-04-06" },
    ],
    notes: [
      { id: "n-3", author: "Marketing Team", date: "2026-05-01", message: "Spark ads outperforming standard by 2.3x ROAS." },
    ],
  },
  {
    id: "cmp-1003",
    name: "High-Intent Search",
    platform: "google",
    goal: "Lead Generation",
    status: "paused",
    budget: 28000,
    spent: 18400,
    startDate: "2026-02-10",
    endDate: "2026-05-20",
    performance: 71,
    views: 154000,
    clicks: 12300,
    leads: 2980,
    conversions: 760,
    revenue: 54200,
    performanceSeries: buildSeries(18000, 0.12),
    expenses: [
      { id: "exp-7", title: "Google Ads Spend", amount: 15400, date: "2026-03-01", notes: "Search + PMax" },
      { id: "exp-8", title: "Keyword Research", amount: 1500, date: "2026-02-12" },
    ],
    notes: [
      { id: "n-4", author: "Account Manager", date: "2026-05-05", message: "Paused to reallocate budget toward TikTok launch." },
    ],
  },
  {
    id: "cmp-1004",
    name: "Cart Abandoner Retargeting",
    platform: "meta",
    goal: "Conversions",
    status: "active",
    budget: 18000,
    spent: 11900,
    startDate: "2026-04-18",
    endDate: "2026-08-01",
    performance: 84,
    views: 198000,
    clicks: 15600,
    leads: 3420,
    conversions: 1180,
    revenue: 78900,
    performanceSeries: buildSeries(20000, 0.16),
    expenses: [
      { id: "exp-9", title: "Meta Ads Spend", amount: 9800, date: "2026-05-01", notes: "Dynamic product ads" },
      { id: "exp-10", title: "Feed Optimization", amount: 1100, date: "2026-04-20" },
    ],
    notes: [
      { id: "n-5", author: "Marketing Team", date: "2026-05-12", message: "ROAS at 6.6x. Recommend increasing daily budget." },
    ],
  },
  {
    id: "cmp-1005",
    name: "Summer Promo 2026",
    platform: "google",
    goal: "Sales",
    status: "completed",
    budget: 36000,
    spent: 35400,
    startDate: "2025-12-01",
    endDate: "2026-02-28",
    performance: 95,
    views: 421000,
    clicks: 33800,
    leads: 7120,
    conversions: 2240,
    revenue: 168000,
    performanceSeries: buildSeries(45000, 0.2),
    expenses: [
      { id: "exp-11", title: "Google Ads Spend", amount: 29800, date: "2026-01-10", notes: "Shopping + Search" },
      { id: "exp-12", title: "Creative Assets", amount: 3600, date: "2025-12-05" },
      { id: "exp-13", title: "Analytics Setup", amount: 2000, date: "2025-12-02" },
    ],
    notes: [
      { id: "n-6", author: "Account Manager", date: "2026-03-01", message: "Campaign closed above target with 4.7x ROAS." },
    ],
  },
  {
    id: "cmp-1006",
    name: "Influencer Collab Boost",
    platform: "tiktok",
    goal: "Engagement",
    status: "paused",
    budget: 22000,
    spent: 14300,
    startDate: "2026-03-20",
    endDate: "2026-06-10",
    performance: 76,
    views: 286000,
    clicks: 19400,
    leads: 3110,
    conversions: 690,
    revenue: 41200,
    performanceSeries: buildSeries(26000, 0.1),
    expenses: [
      { id: "exp-14", title: "TikTok Ads Spend", amount: 11800, date: "2026-04-01" },
      { id: "exp-15", title: "Creator Fees", amount: 2500, date: "2026-03-22" },
    ],
    notes: [
      { id: "n-7", author: "Marketing Team", date: "2026-04-28", message: "Engagement strong, conversions soft. Reworking CTA." },
    ],
  },
];

const totalBudget = clientCampaigns.reduce((sum, c) => sum + c.budget, 0);
const totalSpent = clientCampaigns.reduce((sum, c) => sum + c.spent, 0);
const totalLeads = clientCampaigns.reduce((sum, c) => sum + c.leads, 0);
const activeCount = clientCampaigns.filter((c) => c.status === "active").length;

export const clientStats: ClientStat[] = [
  { key: "myCampaigns", value: clientCampaigns.length, description: "Across all platforms", format: "number" },
  { key: "activeCampaigns", value: activeCount, description: "Currently running", format: "number" },
  { key: "totalBudget", value: totalBudget, description: "Allocated this period", format: "currency" },
  { key: "totalSpent", value: totalSpent, description: `${Math.round((totalSpent / totalBudget) * 100)}% of budget used`, format: "currency" },
  { key: "remainingBudget", value: totalBudget - totalSpent, description: "Available to spend", format: "currency" },
  { key: "totalLeads", value: totalLeads, description: "Generated this period", format: "number" },
];

export const budgetUsageData: BudgetUsage = {
  totalBudget,
  totalSpent,
  remainingBudget: totalBudget - totalSpent,
};

export const campaignPerformanceData: PerformancePoint[] = (() => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  return months.map((name, index) => {
    let views = 0;
    let clicks = 0;
    let leads = 0;
    for (const campaign of clientCampaigns) {
      const point = campaign.performanceSeries[index];
      if (point) {
        views += point.views;
        clicks += point.clicks;
        leads += point.leads;
      }
    }
    return { name, views, clicks, leads };
  });
})();

const totalViews = clientCampaigns.reduce((sum, c) => sum + c.views, 0);
const totalClicks = clientCampaigns.reduce((sum, c) => sum + c.clicks, 0);
const totalRevenue = clientCampaigns.reduce((sum, c) => sum + c.revenue, 0);

export const reportsData: ReportsData = {
  summary: {
    totalViews,
    totalClicks,
    totalLeads,
    totalSpent,
    totalRevenue,
    netProfit: totalRevenue - totalSpent,
  },
  performance: campaignPerformanceData,
  revenueVsExpenses: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map(
    (name, index) => ({
      name,
      revenue: Math.round((totalRevenue / 7) * (0.7 + index * 0.09)),
      expenses: Math.round((totalSpent / 7) * (0.8 + index * 0.06)),
    })
  ),
  leadsByPlatform: (() => {
    const byPlatform: Record<string, number> = {};
    for (const campaign of clientCampaigns) {
      byPlatform[campaign.platform] =
        (byPlatform[campaign.platform] ?? 0) + campaign.leads;
    }
    const labels: Record<string, string> = {
      meta: "Meta Ads",
      tiktok: "TikTok Ads",
      google: "Google Ads",
    };
    return Object.entries(byPlatform).map(([platform, leads]) => ({
      name: labels[platform] ?? platform,
      leads,
    }));
  })(),
  bestPerforming: [...clientCampaigns]
    .sort((a, b) => b.performance - a.performance)
    .slice(0, 5),
};

export function getClientCampaignById(id: string): ClientCampaign | undefined {
  return clientCampaigns.find((campaign) => campaign.id === id);
}
