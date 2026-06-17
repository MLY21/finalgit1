import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const platformLabel: Record<string, string> = {
  META: "Meta Ads",
  TIKTOK: "TikTok Ads",
  GOOGLE: "Google Ads",
};
const statusLabel: Record<string, string> = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  COMPLETED: "Completed",
};
const goalLabel: Record<string, string> = {
  LEADS: "Leads",
  BRAND_AWARENESS: "Brand Awareness",
  TRAFFIC: "Traffic",
  ENGAGEMENT: "Engagement",
  SALES: "Sales",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const campaign = await prisma.campaign.findFirst({
    where: {
      id,
      socialPage: { client: { adminId: user.id } },
    },
    include: {
      socialPage: {
        include: { client: { select: { id: true, name: true } } },
      },
      client: { select: { id: true, name: true } },
      performancePoints: {
        orderBy: { date: "asc" },
      },
    },
  });

  if (!campaign) {
    return NextResponse.json({ success: false, message: "Campaign not found" }, { status: 404 });
  }

  const pts = campaign.performancePoints;

  const totalViews       = pts.reduce((s, p) => s + p.impressions, 0);
  const totalClicks      = pts.reduce((s, p) => s + p.clicks, 0);
  const totalLeads       = pts.reduce((s, p) => s + p.messagesStarted, 0);
  const totalConversions = pts.reduce((s, p) => s + p.conversions, 0);
  const totalSpend       = pts.reduce((s, p) => s + Number(p.spend), 0);

  const pad = (n: number) => String(n).padStart(2, "0");
  const fmtDate = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const performanceOverTime = pts.map((p) => ({
    date: fmtDate(new Date(p.date)),
    views: p.impressions,
    clicks: p.clicks,
    leads: p.leads,
  }));

  // Build per-day spend as "expenses" rows
  const expenses = pts
    .filter((p) => Number(p.spend) > 0)
    .map((p) => ({
      name: `Ad Spend – ${fmtDate(new Date(p.date))}`,
      amount: Number(p.spend),
      date: fmtDate(new Date(p.date)),
    }));

  const ctr = totalViews > 0 ? parseFloat(((totalClicks / totalViews) * 100).toFixed(2)) : 0;
  const cpl = totalLeads > 0 ? parseFloat((totalSpend / totalLeads).toFixed(2)) : 0;
  const conversionRate = totalClicks > 0 ? parseFloat(((totalConversions / totalClicks) * 100).toFixed(2)) : 0;

  const data = {
    id: campaign.id,
    name: campaign.name,
    clientId: campaign.socialPage?.client?.id ?? campaign.client?.id ?? null,
    clientName: campaign.socialPage?.client?.name ?? campaign.client?.name ?? null,
    platform: platformLabel[campaign.platform] ?? campaign.platform,
    status: statusLabel[campaign.status] ?? campaign.status,
    marketingGoal: goalLabel[campaign.marketingGoal] ?? campaign.marketingGoal,
    budget: Number(campaign.budget),
    spent: parseFloat(totalSpend.toFixed(2)),
    revenue: 0,
    profit: 0,
    views: totalViews,
    clicks: totalClicks,
    leads: totalLeads,
    conversions: totalConversions,
    ctr,
    cpl,
    conversionRate,
    startDate: fmtDate(new Date(campaign.startDate)),
    endDate: fmtDate(new Date(campaign.endDate)),
    description: campaign.description ?? "",
    externalCampaignId: campaign.externalCampaignId ?? "—",
    externalAdAccountId: campaign.externalAdAccountId ?? "—",
    lastSync: campaign.lastSync
      ? campaign.lastSync.toISOString().replace("T", " ").slice(0, 16)
      : "Never",
    expenses,
    performanceOverTime,
  };

  return NextResponse.json({ success: true, data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const campaign = await prisma.campaign.findFirst({
    where: {
      id,
      socialPage: { client: { adminId: user.id } },
    },
  });

  if (!campaign) {
    return NextResponse.json({ success: false, message: "Campaign not found" }, { status: 404 });
  }

  await prisma.campaign.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
