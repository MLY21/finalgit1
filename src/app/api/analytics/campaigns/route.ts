import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sortBy = searchParams.get("sortBy") || "spend";
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        socialPage: { select: { name: true, client: { select: { name: true } } } },
        performancePoints: {
          select: {
            impressions: true,
            reach: true,
            clicks: true,
            uniqueClicks: true,
            spend: true,
            cpc: true,
            ctr: true,
            frequency: true,
            engagements: true,
            reactions: true,
            comments: true,
            videoViews: true,
            messagesStarted: true,
          },
        },
      },
    });

    const withTotals = campaigns.map((c) => {
      const p = c.performancePoints;
      const totals = {
        impressions: p.reduce((s, x) => s + x.impressions, 0),
        reach: p.reduce((s, x) => s + x.reach, 0),
        clicks: p.reduce((s, x) => s + x.clicks, 0),
        uniqueClicks: p.reduce((s, x) => s + x.uniqueClicks, 0),
        spend: Number(p.reduce((s, x) => s + Number(x.spend), 0)),
        engagements: p.reduce((s, x) => s + x.engagements, 0),
        reactions: p.reduce((s, x) => s + x.reactions, 0),
        comments: p.reduce((s, x) => s + x.comments, 0),
        videoViews: p.reduce((s, x) => s + x.videoViews, 0),
        messagesStarted: p.reduce((s, x) => s + x.messagesStarted, 0),
      };

      // Average rates weighted by impressions
      const totalImpressions = totals.impressions || 1;
      const weightedCtr = p.reduce((s, x) => s + Number(x.ctr ?? 0) * x.impressions, 0) / totalImpressions;
      const weightedCpc = p.reduce((s, x) => s + Number(x.cpc ?? 0) * x.clicks, 0) / (totals.clicks || 1);
      const avgFrequency = p.length ? p.reduce((s, x) => s + Number(x.frequency ?? 0), 0) / p.length : 0;

      return {
        id: c.id,
        name: c.name,
        platform: c.platform,
        status: c.status,
        pageName: c.socialPage?.name ?? null,
        clientName: c.socialPage?.client?.name ?? null,
        ...totals,
        ctr: weightedCtr,
        cpc: weightedCpc,
        frequency: avgFrequency,
      };
    });

    // Sort
    const sorted = withTotals.sort((a, b) => {
      const aVal = (a as any)[sortBy] ?? 0;
      const bVal = (b as any)[sortBy] ?? 0;
      return bVal - aVal;
    });

    return NextResponse.json({ success: true, data: sorted.slice(0, limit) });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message ?? "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
