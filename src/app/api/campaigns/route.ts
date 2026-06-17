import { NextResponse } from "next/server";
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

export async function GET() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const campaigns = await prisma.campaign.findMany({
    where: {
      OR: [
        { socialPage: { client: { adminId: user.id } } },
        { pageId: null, client: { adminId: user.id } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      socialPage: {
        include: { client: { select: { id: true, name: true } } },
      },
      client: { select: { id: true, name: true } },
      performancePoints: {
        orderBy: { date: "desc" },
        take: 1,
      },
    },
  });

  const result = campaigns.map((c) => {
    const totalLeads = c.performancePoints.reduce((s, p) => s + p.messagesStarted, 0);
    const totalSpend = c.performancePoints.reduce((s, p) => s + Number(p.spend), 0);

    return {
      id: c.id,
      name: c.name,
      clientId:   c.socialPage?.client?.id   ?? c.client?.id   ?? null,
      clientName: c.socialPage?.client?.name ?? c.client?.name ?? null,
      platform: platformLabel[c.platform] ?? c.platform,
      status: statusLabel[c.status] ?? c.status,
      marketingGoal: c.marketingGoal,
      budget: Number(c.budget),
      spent: totalSpend,
      leads: totalLeads,
      clicks: c.performancePoints.reduce((s, p) => s + p.clicks, 0),
      views: c.performancePoints.reduce((s, p) => s + p.impressions, 0),
      conversions: c.performancePoints.reduce((s, p) => s + p.conversions, 0),
      revenue: 0,
      profit: 0,
      startDate: c.startDate.toISOString().split("T")[0],
      endDate: c.endDate.toISOString().split("T")[0],
      description: c.description ?? "",
      externalCampaignId: c.externalCampaignId ?? "",
      externalAdAccountId: c.externalAdAccountId ?? "",
      assignmentStatus: c.assignmentStatus,
      assignedClientId:   c.client?.id   ?? null,
      assignedClientName: c.client?.name ?? null,
      lastSync: c.lastSync
        ? c.lastSync.toISOString().replace("T", " ").slice(0, 16)
        : "Never",
      expenses: [],
      performanceOverTime: [],
    };
  });

  return NextResponse.json({ success: true, data: result });
}
