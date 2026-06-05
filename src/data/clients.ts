export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  businessType: "E-commerce" | "Restaurant" | "Clinic" | "Education" | "Real Estate" | "Other";
  status: "active" | "inactive" | "pending";
  campaignsCount: number;
  totalBudget: number;
  totalRevenue: number;
  notes: string;
  createdAt: string;
}

export interface ClientCampaign {
  id: string;
  name: string;
  platform: "meta" | "tiktok" | "google";
  status: "active" | "paused" | "completed";
  budget: number;
  spent: number;
  performance: number;
  date: string;
}

export interface ClientPerformancePoint {
  name: string; // Day/Month name
  views: number;
  clicks: number;
  leads: number;
}

export interface ClientActivity {
  id: string;
  clientName: string;
  type: "created" | "budget_updated" | "report_generated" | "completed";
  description: string;
  timestamp: string;
}

export const mockClients: Client[] = [
  {
    id: "cl-1",
    name: "Ali Al-Faturi",
    company: "Tripoli Tech Shop",
    email: "ali@tripolitech.ly",
    phone: "+218 91 123 4567",
    businessType: "E-commerce",
    status: "active",
    campaignsCount: 3,
    totalBudget: 15000,
    totalRevenue: 45000,
    notes: "Prefers Meta Ads campaigns. Monthly budget is around 5,000 LYD.",
    createdAt: "2025-01-10",
  },
  {
    id: "cl-2",
    name: "Huda El-Mabrouk",
    company: "Emaar Real Estate",
    email: "huda@emaar.ly",
    phone: "+218 92 987 6543",
    businessType: "Real Estate",
    status: "active",
    campaignsCount: 2,
    totalBudget: 24000,
    totalRevenue: 98000,
    notes: "Focuses on Google Search and TikTok video tours. High lead quality is key.",
    createdAt: "2025-02-15",
  },
  {
    id: "cl-3",
    name: "Mona Al-Suhaibi",
    company: "Cure Clinic",
    email: "mona@cure.ly",
    phone: "+218 91 555 4321",
    businessType: "Clinic",
    status: "pending",
    campaignsCount: 1,
    totalBudget: 4500,
    totalRevenue: 0,
    notes: "Newly onboarded medical center. Starting with brand awareness on Meta Ads.",
    createdAt: "2026-05-20",
  },
  {
    id: "cl-4",
    name: "Tarek Ben Halim",
    company: "Burger House",
    email: "tarek@burgerhouse.ly",
    phone: "+218 91 444 8899",
    businessType: "Restaurant",
    status: "active",
    campaignsCount: 4,
    totalBudget: 12000,
    totalRevenue: 38000,
    notes: "Focuses heavily on regional TikTok promotion and local Meta awareness campaigns.",
    createdAt: "2024-11-05",
  },
  {
    id: "cl-5",
    name: "Sarah Al-Gheriani",
    company: "Learn Academy",
    email: "sarah@learn.ly",
    phone: "+218 92 333 7711",
    businessType: "Education",
    status: "inactive",
    campaignsCount: 0,
    totalBudget: 0,
    totalRevenue: 0,
    notes: "Seasonal educational courses. Campaigns paused until next registration cycle.",
    createdAt: "2025-08-12",
  },
];

export const mockClientCampaigns: Record<string, ClientCampaign[]> = {
  "cl-1": [
    {
      id: "cc-101",
      name: "Tech Summer Sale Boost",
      platform: "meta",
      status: "active",
      budget: 6000,
      spent: 4200,
      performance: 88,
      date: "2026-05-01",
    },
    {
      id: "cc-102",
      name: "E-comm Flash Conversions",
      platform: "meta",
      status: "active",
      budget: 5000,
      spent: 3100,
      performance: 84,
      date: "2026-05-15",
    },
    {
      id: "cc-103",
      name: "Accessories Catalogue Promotion",
      platform: "google",
      status: "completed",
      budget: 4000,
      spent: 4000,
      performance: 92,
      date: "2026-04-01",
    },
  ],
  "cl-2": [
    {
      id: "cc-201",
      name: "Luxury Villas Lead Gen",
      platform: "google",
      status: "active",
      budget: 14000,
      spent: 9800,
      performance: 90,
      date: "2026-04-20",
    },
    {
      id: "cc-202",
      name: "New Heights TikTok Video Ads",
      platform: "tiktok",
      status: "active",
      budget: 10000,
      spent: 7200,
      performance: 78,
      date: "2026-05-10",
    },
  ],
  "cl-3": [
    {
      id: "cc-301",
      name: "Cure Clinic Brand Awareness",
      platform: "meta",
      status: "active",
      budget: 4500,
      spent: 1200,
      performance: 75,
      date: "2026-05-21",
    },
  ],
  "cl-4": [
    {
      id: "cc-401",
      name: "Weekly TikTok Combo Promo",
      platform: "tiktok",
      status: "active",
      budget: 4000,
      spent: 2800,
      performance: 91,
      date: "2026-05-01",
    },
    {
      id: "cc-402",
      name: "Meta Local Delivery Boost",
      platform: "meta",
      status: "active",
      budget: 3000,
      spent: 1900,
      performance: 82,
      date: "2026-05-05",
    },
    {
      id: "cc-403",
      name: "Ramadan Burger Feast Campaign",
      platform: "meta",
      status: "completed",
      budget: 3500,
      spent: 3500,
      performance: 95,
      date: "2026-03-01",
    },
    {
      id: "cc-404",
      name: "Google Maps Restaurant Presence",
      platform: "google",
      status: "paused",
      budget: 1500,
      spent: 450,
      performance: 65,
      date: "2026-04-15",
    },
  ],
  "cl-5": [],
};

export const mockClientPerformance: Record<string, ClientPerformancePoint[]> = {
  "cl-1": [
    { name: "Week 1", views: 24000, clicks: 1440, leads: 260 },
    { name: "Week 2", views: 28000, clicks: 1680, leads: 310 },
    { name: "Week 3", views: 35000, clicks: 2100, leads: 380 },
    { name: "Week 4", views: 42000, clicks: 2520, leads: 460 },
  ],
  "cl-2": [
    { name: "Week 1", views: 18000, clicks: 1080, leads: 190 },
    { name: "Week 2", views: 22000, clicks: 1320, leads: 240 },
    { name: "Week 3", views: 26000, clicks: 1560, leads: 290 },
    { name: "Week 4", views: 31000, clicks: 1860, leads: 340 },
  ],
  "cl-3": [
    { name: "Week 1", views: 8000, clicks: 480, leads: 70 },
    { name: "Week 2", views: 11000, clicks: 660, leads: 95 },
    { name: "Week 3", views: 12000, clicks: 720, leads: 110 },
    { name: "Week 4", views: 14000, clicks: 840, leads: 130 },
  ],
  "cl-4": [
    { name: "Week 1", views: 31000, clicks: 1860, leads: 320 },
    { name: "Week 2", views: 35000, clicks: 2100, leads: 370 },
    { name: "Week 3", views: 38000, clicks: 2280, leads: 410 },
    { name: "Week 4", views: 44000, clicks: 2640, leads: 480 },
  ],
  "cl-5": [
    { name: "Week 1", views: 0, clicks: 0, leads: 0 },
    { name: "Week 2", views: 0, clicks: 0, leads: 0 },
    { name: "Week 3", views: 0, clicks: 0, leads: 0 },
    { name: "Week 4", views: 0, clicks: 0, leads: 0 },
  ],
};

export const mockClientActivities: ClientActivity[] = [
  {
    id: "act-1",
    clientName: "Ali Al-Faturi",
    type: "created",
    description: "Campaign 'E-comm Flash Conversions' was created.",
    timestamp: "2026-05-15T14:32:00Z",
  },
  {
    id: "act-2",
    clientName: "Ali Al-Faturi",
    type: "budget_updated",
    description: "Budget for 'Tech Summer Sale Boost' was increased by 2,000 LYD.",
    timestamp: "2026-05-12T10:15:00Z",
  },
  {
    id: "act-3",
    clientName: "Huda El-Mabrouk",
    type: "report_generated",
    description: "April Performance Report was generated.",
    timestamp: "2026-05-02T09:00:00Z",
  },
  {
    id: "act-4",
    clientName: "Tarek Ben Halim",
    type: "completed",
    description: "Campaign 'Ramadan Burger Feast Campaign' successfully completed.",
    timestamp: "2026-04-10T18:45:00Z",
  },
  {
    id: "act-5",
    clientName: "Mona Al-Suhaibi",
    type: "created",
    description: "Client account Cure Clinic was created and activated.",
    timestamp: "2026-05-20T11:20:00Z",
  },
];
