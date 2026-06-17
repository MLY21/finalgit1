import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const points = await prisma.campaignPerformance.findMany({
      select: { date: true, impressions: true, reach: true, clicks: true, engagements: true },
      orderBy: { date: "asc" },
    });

    const monthly = new Map<string, { impressions: number; reach: number; clicks: number; engagements: number }>();

    for (const p of points) {
      const key = p.date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      const existing = monthly.get(key) ?? { impressions: 0, reach: 0, clicks: 0, engagements: 0 };
      existing.impressions += p.impressions;
      existing.reach += p.reach;
      existing.clicks += p.clicks;
      existing.engagements += p.engagements;
      monthly.set(key, existing);
    }

    const result = Array.from(monthly.entries()).map(([name, data]) => ({
      name,
      impressions: data.impressions,
      reach: data.reach,
      clicks: data.clicks,
      engagements: data.engagements,
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message ?? "Failed to fetch trend data" },
      { status: 500 }
    );
  }
}
