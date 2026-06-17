import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { clientId: true },
  });

  if (!userData?.clientId) {
    return NextResponse.json({ success: false, message: "No client linked" }, { status: 404 });
  }

  const { id } = await params;

  const campaign = await prisma.campaign.findFirst({
    where: {
      id,
      OR: [
        { socialPage: { clientId: userData.clientId } },
        { clientId: userData.clientId },
      ],
    },
    include: {
      performancePoints: { orderBy: { date: "asc" } },
    },
  });

  if (!campaign) {
    return NextResponse.json({ success: false, message: "Campaign not found" }, { status: 404 });
  }

  const pts = campaign.performancePoints;

  const totalViews       = pts.reduce((s, p) => s + p.impressions, 0);
  const totalReach       = pts.reduce((s, p) => s + p.reach, 0);
  const totalClicks      = pts.reduce((s, p) => s + p.clicks, 0);
  const totalUniqueClicks = pts.reduce((s, p) => s + p.uniqueClicks, 0);
  const totalMessages    = pts.reduce((s, p) => s + p.messagesStarted, 0);
  const totalConversions = pts.reduce((s, p) => s + p.conversions, 0);
  const totalSpend       = pts.reduce((s, p) => s + Number(p.spend), 0);
  const totalEngagements = pts.reduce((s, p) => s + p.engagements, 0);
  const totalReactions   = pts.reduce((s, p) => s + p.reactions, 0);
  const totalComments    = pts.reduce((s, p) => s + p.comments, 0);
  const totalVideoViews  = pts.reduce((s, p) => s + p.videoViews, 0);

  const ctr = totalViews > 0 ? parseFloat(((totalClicks / totalViews) * 100).toFixed(2)) : 0;
  const cpl = totalMessages > 0 ? parseFloat((totalSpend / totalMessages).toFixed(2)) : 0;
  const conversionRate = totalClicks > 0 ? parseFloat(((totalConversions / totalClicks) * 100).toFixed(2)) : 0;
  const avgCpc = pts.length ? parseFloat((pts.reduce((s, p) => s + Number(p.cpc ?? 0), 0) / pts.length).toFixed(4)) : 0;
  const avgFrequency = pts.length ? parseFloat((pts.reduce((s, p) => s + Number(p.frequency ?? 0), 0) / pts.length).toFixed(2)) : 0;

  const pad = (n: number) => String(n).padStart(2, "0");
  const fmtDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const performanceOverTime = pts.map((p) => ({
    date: fmtDate(new Date(p.date)),
    views: p.impressions,
    clicks: p.clicks,
    leads: p.messagesStarted,
  }));

  const data = {
    id: campaign.id,
    name: campaign.name,
    platform: campaign.platform,
    status: campaign.status,
    marketingGoal: campaign.marketingGoal,
    budget: Number(campaign.budget),
    spent: parseFloat(totalSpend.toFixed(2)),
    views: totalViews,
    reach: totalReach,
    clicks: totalClicks,
    uniqueClicks: totalUniqueClicks,
    ctr,
    cpc: avgCpc,
    frequency: avgFrequency,
    engagements: totalEngagements,
    reactions: totalReactions,
    comments: totalComments,
    videoViews: totalVideoViews,
    leads: totalMessages,
    conversions: totalConversions,
    conversionRate,
    cpl,
    startDate: fmtDate(new Date(campaign.startDate)),
    endDate: fmtDate(new Date(campaign.endDate)),
    description: campaign.description ?? "",
    externalCampaignId: campaign.externalCampaignId ?? "—",
    lastSync: campaign.lastSync
      ? campaign.lastSync.toISOString().replace("T", " ").slice(0, 16)
      : "Never",
    performanceOverTime,
  };

  return NextResponse.json({ success: true, data });
}
