import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // Find the client linked to this user
  const client = await prisma.client.findFirst({
    where: { user: { id: user.id } },
    include: {
      socialPages: { select: { id: true } },
    },
  });

  if (!client) {
    return NextResponse.json({ success: true, data: { campaigns: [], stats: [], performance: [], budget: null } });
  }

  const pageIds = client.socialPages.map((p) => p.id);

  // Fetch campaigns linked to this client (via socialPage OR direct client relation)
  const campaigns = await prisma.campaign.findMany({
    where: {
      OR: [
        { pageId: { in: pageIds } },
        { clientId: client.id },
      ],
    },
    include: {
      performancePoints: { orderBy: { date: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Compute totals
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;
  const allPts = campaigns.flatMap((c) => c.performancePoints);

  const totalSpend = allPts.reduce((s, p) => s + Number(p.spend), 0);
  const totalReach = allPts.reduce((s, p) => s + p.reach, 0);
  const totalImpressions = allPts.reduce((s, p) => s + p.impressions, 0);
  const totalClicks = allPts.reduce((s, p) => s + p.clicks, 0);
  const totalEngagements = allPts.reduce((s, p) => s + p.engagements, 0);
  const totalMessages = allPts.reduce((s, p) => s + p.messagesStarted, 0);

  const avgCtr = allPts.length
    ? allPts.reduce((s, p) => s + Number(p.ctr ?? 0), 0) / allPts.length
    : 0;
  const avgCpc = allPts.length
    ? allPts.reduce((s, p) => s + Number(p.cpc ?? 0), 0) / allPts.length
    : 0;

  const totalBudget = campaigns.reduce((s, c) => s + Number(c.budget), 0);

  // Stats cards
  const stats = [
    { key: "myCampaigns", value: totalCampaigns, description: "Across all platforms", format: "number" as const },
    { key: "activeCampaigns", value: activeCampaigns, description: "Currently running", format: "number" as const },
    { key: "totalBudget", value: totalBudget, description: "Allocated this period", format: "currency" as const },
    { key: "totalSpent", value: totalSpend, description: totalBudget > 0 ? `${Math.round((totalSpend / totalBudget) * 100)}% of budget used` : "0% of budget used", format: "currency" as const },
    { key: "remainingBudget", value: totalBudget - totalSpend, description: "Available to spend", format: "currency" as const },
    { key: "totalLeads", value: totalMessages, description: "Messages started this period", format: "number" as const },
  ];

  // Performance trend (monthly aggregation)
  const monthly = new Map<string, { views: number; clicks: number; leads: number }>();
  for (const p of allPts) {
    const key = p.date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const existing = monthly.get(key) ?? { views: 0, clicks: 0, leads: 0 };
    existing.views += p.impressions;
    existing.clicks += p.clicks;
    existing.leads += p.messagesStarted;
    monthly.set(key, existing);
  }
  const performance = Array.from(monthly.entries()).map(([name, data]) => ({ name, ...data }));

  // Budget usage
  const budget = {
    totalBudget,
    totalSpend,
    remainingBudget: totalBudget - totalSpend,
  };

  // Recent campaigns (simplified)
  const recentCampaigns = campaigns.slice(0, 5).map((c) => {
    const pts = c.performancePoints;
    return {
      id: c.id,
      name: c.name,
      platform: c.platform.toLowerCase(),
      goal: c.marketingGoal,
      status: c.status.toLowerCase(),
      budget: Number(c.budget),
      spent: pts.reduce((s, p) => s + Number(p.spend), 0),
      startDate: c.startDate.toISOString().split("T")[0],
      endDate: c.endDate.toISOString().split("T")[0],
      views: pts.reduce((s, p) => s + p.impressions, 0),
      clicks: pts.reduce((s, p) => s + p.clicks, 0),
      leads: pts.reduce((s, p) => s + p.messagesStarted, 0),
      conversions: pts.reduce((s, p) => s + p.conversions, 0),
      performance: pts.length
        ? Math.min(Math.round((pts.reduce((s, p) => s + p.clicks, 0) / Math.max(pts.reduce((s, p) => s + p.impressions, 0), 1)) * 1000), 100)
        : 0,
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      clientName: client.name,
      stats,
      performance,
      budget,
      campaigns: recentCampaigns,
      totalCampaigns,
    },
  });
}
