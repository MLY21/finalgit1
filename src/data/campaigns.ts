export interface CampaignDetails {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  platform: "Meta Ads" | "Google Ads" | "TikTok Ads";
  status: "Active" | "Paused" | "Completed";
  marketingGoal: "Brand Awareness" | "Traffic" | "Engagement" | "Leads" | "Sales";
  budget: number;
  spent: number;
  leads: number;
  clicks: number;
  views: number;
  conversions: number;
  startDate: string;
  endDate: string;
  description: string;
  revenue: number;
  profit: number;
  externalCampaignId: string;
  externalAdAccountId: string;
  lastSync: string;
  expenses: Array<{ name: string; amount: number; date: string }>;
  performanceOverTime: Array<{ date: string; views: number; clicks: number; leads: number }>;
}

export interface ExternalCampaignMock {
  id: string;
  name: string;
  platform: "Meta Ads" | "Google Ads" | "TikTok Ads";
  budget: number;
  externalCampaignId: string;
  externalAdAccountId: string;
}

export const mockExternalCampaigns: ExternalCampaignMock[] = [
  {
    id: "ext-1",
    name: "Meta Lead Generation Promo",
    platform: "Meta Ads",
    budget: 15000,
    externalCampaignId: "act_448299103_camp_11055",
    externalAdAccountId: "acc_99281123490"
  },
  {
    id: "ext-2",
    name: "Instagram Stories Retargeting",
    platform: "Meta Ads",
    budget: 8000,
    externalCampaignId: "act_448299103_camp_11066",
    externalAdAccountId: "acc_99281123490"
  },
  {
    id: "ext-3",
    name: "Google Search Brand Protection",
    platform: "Google Ads",
    budget: 12000,
    externalCampaignId: "g_ads_camp_8829144",
    externalAdAccountId: "g_acc_339103982"
  },
  {
    id: "ext-4",
    name: "TikTok Video Viral Challenge",
    platform: "TikTok Ads",
    budget: 6000,
    externalCampaignId: "tt_camp_11203999",
    externalAdAccountId: "tt_acc_7728391039"
  }
];

export const mockCampaigns: CampaignDetails[] = [
  {
    id: "camp-1",
    name: "Summer Sale 2025",
    clientId: "cl-1",
    clientName: "Ali Al-Faturi",
    platform: "Meta Ads",
    status: "Active",
    marketingGoal: "Sales",
    budget: 12000,
    spent: 4800,
    leads: 156,
    clicks: 1240,
    views: 32000,
    conversions: 78,
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    description: "Meta Ads campaign maximizing conversions and traffic for Tripoli Tech Shop's summer collection.",
    revenue: 18000,
    profit: 13200,
    externalCampaignId: "act_448299103_camp_99210",
    externalAdAccountId: "acc_99281123490",
    lastSync: "2026-06-02 22:15",
    expenses: [
      { name: "Facebook Video Ads Spend", amount: 2800, date: "2025-06-15" },
      { name: "Instagram Carousel Ads Spend", amount: 1200, date: "2025-06-20" },
      { name: "Video Creative Production", amount: 500, date: "2025-05-28" },
      { name: "Graphic Design (Banner Ads)", amount: 300, date: "2025-05-29" }
    ],
    performanceOverTime: [
      { date: "Jun 01", views: 2000, clicks: 80, leads: 10 },
      { date: "Jun 05", views: 4500, clicks: 170, leads: 22 },
      { date: "Jun 10", views: 8000, clicks: 310, leads: 40 },
      { date: "Jun 15", views: 14000, clicks: 540, leads: 68 },
      { date: "Jun 20", views: 22000, clicks: 850, leads: 110 },
      { date: "Jun 25", views: 32000, clicks: 1240, leads: 156 }
    ]
  },
  {
    id: "camp-2",
    name: "Medical Clinic Lead Gen",
    clientId: "cl-2",
    clientName: "Sarah Al-Mabrouk",
    platform: "Google Ads",
    status: "Active",
    marketingGoal: "Leads",
    budget: 8500,
    spent: 3100,
    leads: 94,
    clicks: 780,
    views: 12000,
    conversions: 42,
    startDate: "2025-05-15",
    endDate: "2025-07-15",
    description: "Google Search Ads and Clinic Landing Page lead generation targeting medical inquiries in Tripoli.",
    revenue: 12500,
    profit: 9400,
    externalCampaignId: "g_ads_camp_8829112",
    externalAdAccountId: "g_acc_339103982",
    lastSync: "2026-06-02 21:40",
    expenses: [
      { name: "Google Search Click Spend", amount: 2500, date: "2025-06-01" },
      { name: "Landing Page Copywriting", amount: 400, date: "2025-05-10" },
      { name: "Graphic Design Elements", amount: 200, date: "2025-05-12" }
    ],
    performanceOverTime: [
      { date: "May 15", views: 1000, clicks: 50, leads: 5 },
      { date: "May 25", views: 3500, clicks: 190, leads: 20 },
      { date: "Jun 05", views: 7000, clicks: 420, leads: 48 },
      { date: "Jun 15", views: 10000, clicks: 610, leads: 74 },
      { date: "Jun 25", views: 12000, clicks: 780, leads: 94 }
    ]
  },
  {
    id: "camp-3",
    name: "Cafe Brand Awareness",
    clientId: "cl-3",
    clientName: "Omar El-Hadi",
    platform: "TikTok Ads",
    status: "Paused",
    marketingGoal: "Brand Awareness",
    budget: 5000,
    spent: 5000,
    leads: 32,
    clicks: 1850,
    views: 65000,
    conversions: 18,
    startDate: "2025-04-01",
    endDate: "2025-05-01",
    description: "Highly engaging TikTok short video ads showcasing the Benghazi cafe cozy environment and special recipes.",
    revenue: 7500,
    profit: 2500,
    externalCampaignId: "tt_camp_11203948",
    externalAdAccountId: "tt_acc_7728391039",
    lastSync: "2026-06-01 18:30",
    expenses: [
      { name: "TikTok Video Ads Click Spend", amount: 3800, date: "2025-04-15" },
      { name: "Influencer Collaboration", amount: 800, date: "2025-03-25" },
      { name: "Video Creative Editing", amount: 400, date: "2025-03-27" }
    ],
    performanceOverTime: [
      { date: "Apr 05", views: 12000, clicks: 350, leads: 6 },
      { date: "Apr 12", views: 28000, clicks: 780, leads: 14 },
      { date: "Apr 19", views: 45000, clicks: 1200, leads: 22 },
      { date: "Apr 26", views: 58000, clicks: 1650, leads: 29 },
      { date: "May 01", views: 65000, clicks: 1850, leads: 32 }
    ]
  },
  {
    id: "camp-4",
    name: "Real Estate Luxury Villas",
    clientId: "cl-4",
    clientName: "Fatima Al-Warfali",
    platform: "Meta Ads",
    status: "Completed",
    marketingGoal: "Sales",
    budget: 25000,
    spent: 25000,
    leads: 210,
    clicks: 3400,
    views: 85000,
    conversions: 15,
    startDate: "2025-02-01",
    endDate: "2025-04-30",
    description: "Premium Meta Ads lead form and high-quality photo listings targeting luxury villa buyers in Tripoli outskirts.",
    revenue: 45000,
    profit: 20000,
    externalCampaignId: "act_448299103_camp_11029",
    externalAdAccountId: "acc_99281123490",
    lastSync: "2026-05-30 11:20",
    expenses: [
      { name: "Meta Lead Gen Ads Spend", amount: 21500, date: "2025-03-10" },
      { name: "Professional Photography", amount: 2000, date: "2025-01-25" },
      { name: "Graphic Brochure Design", amount: 1500, date: "2025-01-27" }
    ],
    performanceOverTime: [
      { date: "Feb 15", views: 15000, clicks: 600, leads: 35 },
      { date: "Feb 28", views: 32000, clicks: 1200, leads: 72 },
      { date: "Mar 15", views: 50000, clicks: 1950, leads: 120 },
      { date: "Mar 31", views: 68000, clicks: 2600, leads: 165 },
      { date: "Apr 15", views: 78000, clicks: 3100, leads: 192 },
      { date: "Apr 30", views: 85000, clicks: 3400, leads: 210 }
    ]
  }
];
