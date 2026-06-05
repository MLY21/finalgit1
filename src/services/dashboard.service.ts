import type { DashboardOverview } from "@/types";

const mockOverview: DashboardOverview = {
  stats: [
    { key: "totalClients", value: 48, change: 12.5, trend: "up" },
    { key: "activeCampaigns", value: 24, change: 8.2, trend: "up" },
    { key: "totalLeads", value: 1247, change: 15.3, trend: "up" },
    { key: "totalExpenses", value: 96200, change: -3.1, trend: "down" },
  ],
  campaignPerformance: [
    { name: "Jan", impressions: 4200, clicks: 2400, conversions: 800 },
    { name: "Feb", impressions: 3800, clicks: 2210, conversions: 720 },
    { name: "Mar", impressions: 5100, clicks: 2900, conversions: 980 },
    { name: "Apr", impressions: 4700, clicks: 2780, conversions: 910 },
    { name: "May", impressions: 5900, clicks: 3200, conversions: 1100 },
    { name: "Jun", impressions: 6200, clicks: 3490, conversions: 1240 },
    { name: "Jul", impressions: 6800, clicks: 3800, conversions: 1380 },
  ],
  monthlyExpenses: [
    { name: "Jan", expenses: 12000 },
    { name: "Feb", expenses: 10500 },
    { name: "Mar", expenses: 15000 },
    { name: "Apr", expenses: 13800 },
    { name: "May", expenses: 17500 },
    { name: "Jun", expenses: 19200 },
    { name: "Jul", expenses: 21000 },
  ],
  recentCampaigns: [
    {
      id: "1",
      nameKey: "summerBrandAwareness",
      platform: "meta",
      budget: 15000,
      status: "active",
      performance: 87,
      date: "2026-05-18",
    },
    {
      id: "2",
      nameKey: "productLaunchGenZ",
      platform: "tiktok",
      budget: 8500,
      status: "active",
      performance: 92,
      date: "2026-05-15",
    },
    {
      id: "3",
      nameKey: "searchHighIntent",
      platform: "google",
      budget: 12000,
      status: "paused",
      performance: 64,
      date: "2026-05-10",
    },
    {
      id: "4",
      nameKey: "retargetingCart",
      platform: "meta",
      budget: 6000,
      status: "completed",
      performance: 78,
      date: "2026-05-01",
    },
    {
      id: "5",
      nameKey: "holidayPromo2025",
      platform: "google",
      budget: 22000,
      status: "completed",
      performance: 95,
      date: "2026-04-28",
    },
    {
      id: "6",
      nameKey: "influencerCollab",
      platform: "tiktok",
      budget: 9500,
      status: "paused",
      performance: 71,
      date: "2026-04-20",
    },
  ],
};

export async function getDashboardOverview(): Promise<DashboardOverview> {
  // Replace with: return apiClient<DashboardOverview>("/dashboard/overview");
  await simulateNetworkDelay();
  return mockOverview;
}

function simulateNetworkDelay() {
  return new Promise((resolve) => setTimeout(resolve, 100));
}
