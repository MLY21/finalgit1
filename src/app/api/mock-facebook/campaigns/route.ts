import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export interface MockFBCampaign {
  id: string;
  name: string;
  platform: "Meta Ads" | "Google Ads" | "TikTok Ads";
  externalCampaignId: string;
  externalAdAccountId: string;
  budget: number;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  marketingGoal: "LEADS" | "BRAND_AWARENESS" | "TRAFFIC" | "ENGAGEMENT" | "SALES";
  startDate: string;
  endDate: string;
}

// ── Static mock campaign pool ─────────────────────────────────────────────────
// Meta ad account 1 (act_448299103) → assigned to client 1
// Meta ad account 2 (act_987654321) → assigned to client 2
// Google account (g_acc_339103982) → shared; locked per-client after first import
// TikTok account (tt_acc_9928117)  → shared; locked per-client after first import
const ALL_MOCK_CAMPAIGNS: MockFBCampaign[] = [
  // ── Meta Ads – Account 1 ─────────────────────────────────────
  {
    id: "fb-001",
    name: "Lead Generation – Summer 2026",
    platform: "Meta Ads",
    externalCampaignId: "act_448299103_camp_summer26",
    externalAdAccountId: "act_448299103",
    budget: 12000,
    status: "ACTIVE",
    marketingGoal: "LEADS",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
  },
  {
    id: "fb-002",
    name: "Brand Awareness – Ramadan Campaign",
    platform: "Meta Ads",
    externalCampaignId: "act_448299103_camp_ramadan26",
    externalAdAccountId: "act_448299103",
    budget: 8500,
    status: "COMPLETED",
    marketingGoal: "BRAND_AWARENESS",
    startDate: "2026-02-28",
    endDate: "2026-04-01",
  },
  {
    id: "fb-003",
    name: "Sales Boost – Flash Deals",
    platform: "Meta Ads",
    externalCampaignId: "act_448299103_camp_flash26",
    externalAdAccountId: "act_448299103",
    budget: 18000,
    status: "ACTIVE",
    marketingGoal: "SALES",
    startDate: "2026-05-15",
    endDate: "2026-07-15",
  },
  // ── Meta Ads – Account 2 ─────────────────────────────────────
  {
    id: "fb-004",
    name: "Retargeting – Abandoned Cart",
    platform: "Meta Ads",
    externalCampaignId: "act_987654321_camp_retarget26",
    externalAdAccountId: "act_987654321",
    budget: 5000,
    status: "ACTIVE",
    marketingGoal: "SALES",
    startDate: "2026-04-01",
    endDate: "2026-12-31",
  },
  {
    id: "fb-005",
    name: "Traffic – Blog & Content",
    platform: "Meta Ads",
    externalCampaignId: "act_987654321_camp_traffic26",
    externalAdAccountId: "act_987654321",
    budget: 6500,
    status: "PAUSED",
    marketingGoal: "TRAFFIC",
    startDate: "2026-03-01",
    endDate: "2026-09-30",
  },
  {
    id: "fb-006",
    name: "Engagement – Community Growth",
    platform: "Meta Ads",
    externalCampaignId: "act_987654321_camp_engage26",
    externalAdAccountId: "act_987654321",
    budget: 4000,
    status: "ACTIVE",
    marketingGoal: "ENGAGEMENT",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  },
  // ── Google Ads ────────────────────────────────────────────────
  {
    id: "g-001",
    name: "Search – Brand Protection",
    platform: "Google Ads",
    externalCampaignId: "g_ads_camp_brand26",
    externalAdAccountId: "g_acc_339103982",
    budget: 15000,
    status: "ACTIVE",
    marketingGoal: "TRAFFIC",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  },
  {
    id: "g-002",
    name: "Display – Awareness Q2",
    platform: "Google Ads",
    externalCampaignId: "g_ads_camp_display26",
    externalAdAccountId: "g_acc_339103982",
    budget: 9000,
    status: "PAUSED",
    marketingGoal: "BRAND_AWARENESS",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
  },
  {
    id: "g-003",
    name: "Performance Max – Q3 Sales",
    platform: "Google Ads",
    externalCampaignId: "g_ads_camp_pmax26",
    externalAdAccountId: "g_acc_112233445",
    budget: 20000,
    status: "ACTIVE",
    marketingGoal: "SALES",
    startDate: "2026-07-01",
    endDate: "2026-09-30",
  },
  {
    id: "g-004",
    name: "YouTube – Video Reach",
    platform: "Google Ads",
    externalCampaignId: "g_ads_camp_video26",
    externalAdAccountId: "g_acc_112233445",
    budget: 7000,
    status: "ACTIVE",
    marketingGoal: "BRAND_AWARENESS",
    startDate: "2026-05-01",
    endDate: "2026-08-31",
  },
  // ── TikTok Ads ────────────────────────────────────────────────
  {
    id: "tt-001",
    name: "Gen-Z Product Launch",
    platform: "TikTok Ads",
    externalCampaignId: "tt_camp_genz26",
    externalAdAccountId: "tt_acc_9928117",
    budget: 11000,
    status: "ACTIVE",
    marketingGoal: "SALES",
    startDate: "2026-05-01",
    endDate: "2026-07-31",
  },
  {
    id: "tt-002",
    name: "Influencer Collab – Fashion",
    platform: "TikTok Ads",
    externalCampaignId: "tt_camp_influencer26",
    externalAdAccountId: "tt_acc_9928117",
    budget: 7500,
    status: "PAUSED",
    marketingGoal: "ENGAGEMENT",
    startDate: "2026-03-15",
    endDate: "2026-06-15",
  },
  {
    id: "tt-003",
    name: "Hashtag Challenge – Viral",
    platform: "TikTok Ads",
    externalCampaignId: "tt_camp_viral26",
    externalAdAccountId: "tt_acc_7766554",
    budget: 9500,
    status: "ACTIVE",
    marketingGoal: "ENGAGEMENT",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
  },
  {
    id: "tt-004",
    name: "TopView – Ramadan Special",
    platform: "TikTok Ads",
    externalCampaignId: "tt_camp_topview26",
    externalAdAccountId: "tt_acc_7766554",
    budget: 14000,
    status: "COMPLETED",
    marketingGoal: "BRAND_AWARENESS",
    startDate: "2026-02-01",
    endDate: "2026-04-15",
  },
];

const DB_PLATFORM_MAP: Record<string, string> = {
  "Meta Ads": "META",
  "Google Ads": "GOOGLE",
  "TikTok Ads": "TIKTOK",
};

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const platform = request.nextUrl.searchParams.get("platform");
  const clientId  = request.nextUrl.searchParams.get("clientId");

  // ── Campaigns already imported for THIS specific client ───────
  const imported = await prisma.campaign.findMany({
    where: clientId
      ? { externalCampaignId: { not: null }, socialPage: { clientId } }
      : { externalCampaignId: { not: null }, socialPage: { client: { adminId: user.id } } },
    select: { externalCampaignId: true },
  });
  const importedIds = new Set(imported.map((c) => c.externalCampaignId));

  // Start with full pool, remove already-imported
  let campaigns = ALL_MOCK_CAMPAIGNS.filter((c) => !importedIds.has(c.externalCampaignId));

  // ── Filter by platform ────────────────────────────────────────
  if (platform && platform !== "All Platforms") {
    campaigns = campaigns.filter((c) => c.platform === platform);
  }

  // ── Filter by client's linked ad account ─────────────────────
  // Logic: Client → SocialPage (externalPageId = ad account ID) → Campaigns
  // If the client already has a SocialPage for this platform, show only campaigns
  // from that ad account. If no SocialPage yet, show all (first-time setup).
  if (clientId && platform && platform !== "All Platforms") {
    const dbPlatform = DB_PLATFORM_MAP[platform];
    if (dbPlatform) {
      const socialPage = await prisma.socialPage.findFirst({
        where: { clientId, platform: dbPlatform as any },
        select: { externalPageId: true },
      });
      if (socialPage?.externalPageId) {
        campaigns = campaigns.filter(
          (c) => c.externalAdAccountId === socialPage.externalPageId
        );
      }
      // No social page → show full platform pool (first import will create the page)
    }
  }

  return NextResponse.json({ success: true, data: campaigns });
}
