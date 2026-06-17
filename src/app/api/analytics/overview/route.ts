import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalCampaigns,
      activeCampaigns,
      totalSpendAgg,
      totalReachAgg,
      totalImpressionsAgg,
      totalClicksAgg,
      avgCtrAgg,
      avgCpcAgg,
      totalEngagementsAgg,
      totalMessagesAgg,
    ] = await Promise.all([
      prisma.campaign.count(),
      prisma.campaign.count({ where: { status: "ACTIVE" } }),
      prisma.campaignPerformance.aggregate({ _sum: { spend: true } }),
      prisma.campaignPerformance.aggregate({ _sum: { reach: true } }),
      prisma.campaignPerformance.aggregate({ _sum: { impressions: true } }),
      prisma.campaignPerformance.aggregate({ _sum: { clicks: true } }),
      prisma.campaignPerformance.aggregate({ _avg: { ctr: true } }),
      prisma.campaignPerformance.aggregate({ _avg: { cpc: true } }),
      prisma.campaignPerformance.aggregate({ _sum: { engagements: true } }),
      prisma.campaignPerformance.aggregate({ _sum: { messagesStarted: true } }),
    ]);

    const totalSpend = Number(totalSpendAgg._sum.spend ?? 0);
    const totalReach = totalReachAgg._sum.reach ?? 0;
    const totalImpressions = totalImpressionsAgg._sum.impressions ?? 0;
    const totalClicks = totalClicksAgg._sum.clicks ?? 0;
    const avgCtr = Number(avgCtrAgg._avg.ctr ?? 0);
    const avgCpc = Number(avgCpcAgg._avg.cpc ?? 0);
    const totalEngagements = totalEngagementsAgg._sum.engagements ?? 0;
    const totalMessages = totalMessagesAgg._sum.messagesStarted ?? 0;

    return NextResponse.json({
      success: true,
      data: {
        totalCampaigns,
        activeCampaigns,
        totalSpend,
        totalReach,
        totalImpressions,
        totalClicks,
        avgCtr,
        avgCpc,
        totalEngagements,
        totalMessages,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message ?? "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
