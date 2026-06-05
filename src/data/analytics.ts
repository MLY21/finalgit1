export interface KPICard {
  title: string;
  value: number;
  change: number;
  trend: "up" | "down";
}

export interface PerformanceTrendData {
  name: string;
  views: number;
  clicks: number;
  leads: number;
}

export interface MonthlyAdSpendData {
  name: string;
  adSpend: number;
  metaAds: number;
  googleAds: number;
  tiktokAds: number;
}

export interface PlatformPerformance {
  platform: string;
  views: number;
  clicks: number;
  leads: number;
  adSpend: number;
  leadGrowth: number;
  clickThroughRate: number;
}

export interface TopCampaign {
  id: string;
  name: string;
  client: string;
  platform: string;
  leads: number;
  clicks: number;
  adSpend: number;
  status: "active" | "paused" | "completed";
}

export interface InsightSummary {
  title: string;
  description: string;
  type: "success" | "info" | "warning";
}

export interface CampaignInsight {
  id: string;
  name: string;
  client: string;
  platform: string;
  views: number;
  clicks: number;
  leads: number;
  adSpend: number;
  conversionRate: number;
}

export interface LeadAnalysis {
  totalLeads: number;
  leadGrowth: number;
  leadsByPlatform: {
    platform: string;
    leads: number;
    percentage: number;
  }[];
  leadTrend: {
    month: string;
    leads: number;
  }[];
}

export interface CampaignComparison {
  campaign1: {
    name: string;
    views: number;
    clicks: number;
    leads: number;
    adSpend: number;
  };
  campaign2: {
    name: string;
    views: number;
    clicks: number;
    leads: number;
    adSpend: number;
  };
}

export const analyticsOverview: KPICard[] = [
  {
    title: "Total Views",
    value: 2458900,
    change: 18.5,
    trend: "up",
  },
  {
    title: "Total Clicks",
    value: 84750,
    change: 12.3,
    trend: "up",
  },
  {
    title: "Total Leads",
    value: 1247,
    change: 15.3,
    trend: "up",
  },
  {
    title: "Total Ad Spend",
    value: 96200,
    change: -3.1,
    trend: "down",
  },
];

export const performanceTrendData: PerformanceTrendData[] = [
  { name: "Jan", views: 285000, clicks: 9800, leads: 142 },
  { name: "Feb", views: 320000, clicks: 11200, leads: 168 },
  { name: "Mar", views: 395000, clicks: 13800, leads: 195 },
  { name: "Apr", views: 378000, clicks: 12500, leads: 178 },
  { name: "May", views: 428000, clicks: 15200, leads: 224 },
  { name: "Jun", views: 452000, clicks: 16700, leads: 245 },
  { name: "Jul", views: 200890, clicks: 5550, leads: 95 },
];

export const monthlyAdSpendData: MonthlyAdSpendData[] = [
  { name: "January", adSpend: 12000, metaAds: 5200, googleAds: 4800, tiktokAds: 2000 },
  { name: "February", adSpend: 10500, metaAds: 4500, googleAds: 4200, tiktokAds: 1800 },
  { name: "March", adSpend: 15000, metaAds: 6500, googleAds: 5800, tiktokAds: 2700 },
  { name: "April", adSpend: 13800, metaAds: 5900, googleAds: 5400, tiktokAds: 2500 },
  { name: "May", adSpend: 17500, metaAds: 7500, googleAds: 6800, tiktokAds: 3200 },
  { name: "June", adSpend: 19200, metaAds: 8200, googleAds: 7500, tiktokAds: 3500 },
  { name: "July", adSpend: 8200, metaAds: 3500, googleAds: 3200, tiktokAds: 1500 },
];

export const platformPerformance: PlatformPerformance[] = [
  {
    platform: "Meta Ads",
    views: 985000,
    clicks: 38500,
    leads: 848,
    adSpend: 40800,
    leadGrowth: 22.5,
    clickThroughRate: 3.91,
  },
  {
    platform: "Google Ads",
    views: 875000,
    clicks: 28900,
    leads: 267,
    adSpend: 35900,
    leadGrowth: 8.3,
    clickThroughRate: 3.30,
  },
  {
    platform: "TikTok Ads",
    views: 598900,
    clicks: 17350,
    leads: 132,
    adSpend: 19500,
    leadGrowth: 45.2,
    clickThroughRate: 2.90,
  },
];

export const topCampaigns: TopCampaign[] = [
  {
    id: "1",
    name: "Summer Brand Awareness",
    client: "Tech Solutions Ltd",
    platform: "Meta Ads",
    leads: 245,
    clicks: 8900,
    adSpend: 15000,
    status: "active",
  },
  {
    id: "2",
    name: "Product Launch — Gen Z",
    client: "Fashion Hub",
    platform: "TikTok Ads",
    leads: 198,
    clicks: 6200,
    adSpend: 8500,
    status: "active",
  },
  {
    id: "3",
    name: "Search — High Intent Keywords",
    client: "Real Estate Pro",
    platform: "Google Ads",
    leads: 156,
    clicks: 4200,
    adSpend: 12000,
    status: "paused",
  },
  {
    id: "4",
    name: "Retargeting — Cart Abandoners",
    client: "E-Commerce Plus",
    platform: "Meta Ads",
    leads: 142,
    clicks: 5100,
    adSpend: 6000,
    status: "completed",
  },
  {
    id: "5",
    name: "Holiday Promo 2025",
    client: "Retail Giant",
    platform: "Google Ads",
    leads: 287,
    clicks: 9800,
    adSpend: 22000,
    status: "completed",
  },
];

export const insightsSummary: InsightSummary[] = [
  {
    title: "Meta Ads Performance",
    description: "Meta Ads generated 68% of all leads this month, making it the top performing platform.",
    type: "success",
  },
  {
    title: "Top Campaign",
    description: "Holiday Promo 2025 is the best performing campaign with 287 leads and 2.93% conversion rate.",
    type: "success",
  },
  {
    title: "TikTok Growth",
    description: "TikTok Ads had the highest engagement growth at 45.2%, showing strong potential for future campaigns.",
    type: "info",
  },
  {
    title: "Ad Spend Trend",
    description: "Total ad spend decreased by 3.1% compared to last month due to seasonal campaign pauses.",
    type: "warning",
  },
];

export const campaignInsights: CampaignInsight[] = [
  {
    id: "1",
    name: "Holiday Promo 2025",
    client: "Retail Giant",
    platform: "Google Ads",
    views: 890000,
    clicks: 9800,
    leads: 287,
    adSpend: 22000,
    conversionRate: 2.93,
  },
  {
    id: "2",
    name: "Summer Brand Awareness",
    client: "Tech Solutions Ltd",
    platform: "Meta Ads",
    views: 750000,
    clicks: 8900,
    leads: 245,
    adSpend: 15000,
    conversionRate: 2.75,
  },
];

export const leadAnalysis: LeadAnalysis = {
  totalLeads: 1247,
  leadGrowth: 15.3,
  leadsByPlatform: [
    { platform: "Meta Ads", leads: 848, percentage: 68 },
    { platform: "Google Ads", leads: 267, percentage: 21.4 },
    { platform: "TikTok Ads", leads: 132, percentage: 10.6 },
  ],
  leadTrend: [
    { month: "Jan", leads: 142 },
    { month: "Feb", leads: 168 },
    { month: "Mar", leads: 195 },
    { month: "Apr", leads: 178 },
    { month: "May", leads: 224 },
    { month: "Jun", leads: 245 },
    { month: "Jul", leads: 95 },
  ],
};

export const campaignComparison: CampaignComparison = {
  campaign1: {
    name: "Holiday Promo 2025",
    views: 890000,
    clicks: 9800,
    leads: 287,
    adSpend: 22000,
  },
  campaign2: {
    name: "Summer Brand Awareness",
    views: 750000,
    clicks: 8900,
    leads: 245,
    adSpend: 15000,
  },
};
