import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const platformMap: Record<string, "META" | "TIKTOK" | "GOOGLE"> = {
  "Meta Ads": "META",
  "Google Ads": "GOOGLE",
  "TikTok Ads": "TIKTOK",
};

const goalMap: Record<string, "LEADS" | "BRAND_AWARENESS" | "TRAFFIC" | "ENGAGEMENT" | "SALES"> = {
  LEADS: "LEADS",
  BRAND_AWARENESS: "BRAND_AWARENESS",
  TRAFFIC: "TRAFFIC",
  ENGAGEMENT: "ENGAGEMENT",
  SALES: "SALES",
};

const statusMap: Record<string, "ACTIVE" | "PAUSED" | "COMPLETED"> = {
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  COMPLETED: "COMPLETED",
};

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    clientId,
    externalCampaignId,
    externalAdAccountId,
    name,
    platform,
    status,
    marketingGoal,
    budget,
    startDate,
    endDate,
  } = body;

  if (!clientId || !externalCampaignId || !name || !platform) {
    return NextResponse.json(
      { success: false, message: "Missing required fields: clientId, externalCampaignId, name, platform" },
      { status: 400 }
    );
  }

  // ── Verify the client belongs to this admin ──────────────────
  const client = await prisma.client.findFirst({
    where: { id: clientId, adminId: user.id },
  });
  if (!client) {
    return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
  }

  // ── Prevent duplicate import ─────────────────────────────────
  const existing = await prisma.campaign.findFirst({
    where: {
      externalCampaignId,
      socialPage: { client: { adminId: user.id } },
    },
  });
  if (existing) {
    return NextResponse.json(
      { success: false, message: "Campaign already imported" },
      { status: 409 }
    );
  }

  // ── Find or create a SocialPage for this client + platform ───
  const dbPlatform = platformMap[platform] ?? "META";

  let socialPage = await prisma.socialPage.findFirst({
    where: { clientId, platform: dbPlatform },
  });

  // ── Validate ad account ownership ─────────────────────────────
  // If this client already has a SocialPage for this platform, the campaign's
  // externalAdAccountId must match their page's externalPageId.
  if (socialPage?.externalPageId && externalAdAccountId &&
      socialPage.externalPageId !== externalAdAccountId) {
    return NextResponse.json(
      { success: false, message: "This campaign belongs to a different ad account than the one linked to this client." },
      { status: 403 }
    );
  }

  if (!socialPage) {
    socialPage = await prisma.socialPage.create({
      data: {
        clientId,
        name: `${client.name} – ${platform} Page`,
        platform: dbPlatform,
        externalPageId: externalAdAccountId ?? null,
        isActive: true,
      },
    });
  }

  // ── Create the Campaign ──────────────────────────────────────
  const campaign = await prisma.campaign.create({
    data: {
      pageId: socialPage.id,
      name,
      platform: dbPlatform,
      status: statusMap[status] ?? "PAUSED",
      marketingGoal: goalMap[marketingGoal] ?? "LEADS",
      budget: Number(budget) || 0,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      externalCampaignId,
      externalAdAccountId: externalAdAccountId ?? null,
      lastSync: new Date(),
    },
  });

  // ── Log activity ─────────────────────────────────────────────
  await prisma.activityLog.create({
    data: {
      clientId,
      type: "CAMPAIGN_CREATED",
      description: `Campaign imported for client: ${client.name} — "${name}" from ${platform}.`,
    },
  });

  return NextResponse.json(
    { success: true, message: "Campaign imported successfully", data: { id: campaign.id } },
    { status: 201 }
  );
}
