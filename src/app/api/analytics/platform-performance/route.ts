import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const campaigns = await prisma.campaign.findMany({
      select: {
        platform: true,
        performancePoints: {
          select: {
            impressions: true,
            reach: true,
            clicks: true,
            spend: true,
            engagements: true,
            messagesStarted: true,
            ctr: true,
          },
        },
      },
    });

    const grouped = new Map<string, {
      impressions: number; reach: number; clicks: number; spend: number;
      engagements: number; messages: number; count: number; ctrSum: number; ctrCount: number;
    }>();

    for (const c of campaigns) {
      const key = c.platform;
      const existing = grouped.get(key) ?? {
        impressions: 0, reach: 0, clicks: 0, spend: 0,
        engagements: 0, messages: 0, count: 0, ctrSum: 0, ctrCount: 0,
      };

      for (const p of c.performancePoints) {
        existing.impressions += p.impressions;
        existing.reach += p.reach;
        existing.clicks += p.clicks;
        existing.spend += Number(p.spend);
        existing.engagements += p.engagements;
        existing.messages += p.messagesStarted;
        existing.count += 1;
        if (p.ctr != null) {
          existing.ctrSum += Number(p.ctr);
          existing.ctrCount += 1;
        }
      }
      grouped.set(key, existing);
    }

    const result = Array.from(grouped.entries()).map(([platform, data]) => ({
      platform,
      impressions: data.impressions,
      reach: data.reach,
      clicks: data.clicks,
      spend: data.spend,
      engagements: data.engagements,
      messagesStarted: data.messages,
      clickThroughRate: data.ctrCount > 0 ? data.ctrSum / data.ctrCount : 0,
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message ?? "Failed to fetch platform data" },
      { status: 500 }
    );
  }
}
