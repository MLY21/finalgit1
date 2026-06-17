import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { clientId: true },
  });

  if (!userData?.clientId) {
    return NextResponse.json({ success: false, message: "No client linked to this account" }, { status: 404 });
  }

  const campaigns = await prisma.campaign.findMany({
    where: {
      OR: [
        { socialPage: { clientId: userData.clientId } },
        { clientId: userData.clientId },
      ],
    },
    include: {
      performancePoints: {
        select: {
          impressions: true, reach: true, clicks: true, uniqueClicks: true,
          spend: true, cpc: true, ctr: true, frequency: true,
          engagements: true, reactions: true, comments: true, videoViews: true,
          messagesStarted: true, conversions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const data = campaigns.map((c) => {
    const impressions = c.performancePoints.reduce((s, p) => s + p.impressions, 0);
    const clicks      = c.performancePoints.reduce((s, p) => s + p.clicks, 0);
    const messages    = c.performancePoints.reduce((s, p) => s + p.messagesStarted, 0);
    const conversions = c.performancePoints.reduce((s, p) => s + p.conversions, 0);
    const spend       = c.performancePoints.reduce((s, p) => s + Number(p.spend), 0);
    const budget      = Number(c.budget);
    const ctr            = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpl            = messages > 0 ? spend / messages : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

    return {
      id: c.id,
      name: c.name,
      platform: c.platform.toLowerCase(),
      status: c.status.toLowerCase(),
      marketingGoal: c.marketingGoal,
      budget,
      spend,
      remaining: budget - spend,
      impressions,
      reach: c.performancePoints.reduce((s, p) => s + p.reach, 0),
      clicks,
      uniqueClicks: c.performancePoints.reduce((s, p) => s + p.uniqueClicks, 0),
      ctr,
      cpc: c.performancePoints.length
        ? c.performancePoints.reduce((s, p) => s + Number(p.cpc ?? 0), 0) / c.performancePoints.length
        : 0,
      frequency: c.performancePoints.length
        ? c.performancePoints.reduce((s, p) => s + Number(p.frequency ?? 0), 0) / c.performancePoints.length
        : 0,
      engagements: c.performancePoints.reduce((s, p) => s + p.engagements, 0),
      reactions: c.performancePoints.reduce((s, p) => s + p.reactions, 0),
      comments: c.performancePoints.reduce((s, p) => s + p.comments, 0),
      videoViews: c.performancePoints.reduce((s, p) => s + p.videoViews, 0),
      messages,
      conversions,
      conversionRate,
      performance: impressions > 0 ? Math.min(Math.round((clicks / impressions) * 1000), 100) : 0,
      startDate: c.startDate.toISOString().split("T")[0],
      endDate: c.endDate.toISOString().split("T")[0],
    };
  });

  return NextResponse.json({ success: true, data });
}
