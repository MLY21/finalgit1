import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const adminId = user.id;

  // ── Stats ────────────────────────────────────────────────────
  const totalClients = await prisma.client.count({ where: { adminId } });

  const allCampaigns = await prisma.campaign.findMany({
    where: { socialPage: { client: { adminId } } },
    include: {
      performancePoints: { orderBy: { date: "desc" } },
    },
  });

  const activeCampaigns = allCampaigns.filter((c) => c.status === "ACTIVE").length;
  const totalLeads = allCampaigns.flatMap((c) => c.performancePoints).reduce((s, p) => s + p.leads, 0);
  const totalSpend = allCampaigns.flatMap((c) => c.performancePoints).reduce((s, p) => s + Number(p.spend), 0);

  // ── Campaign performance chart (last 14 days) ────────────────
  const today = new Date();
  const campaignPerformance = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleString("en", { month: "short", day: "numeric" });

    const dayStr = d.toISOString().split("T")[0];
    const pts = allCampaigns
      .flatMap((c) => c.performancePoints)
      .filter((p) => p.date.toISOString().split("T")[0] === dayStr);

    return {
      name: label,
      impressions: pts.reduce((s, p) => s + p.impressions, 0),
      clicks: pts.reduce((s, p) => s + p.clicks, 0),
      conversions: pts.reduce((s, p) => s + p.conversions, 0),
    };
  });

  // ── Monthly spend chart (last 7 months) ─────────────────────
  const monthlyExpenses = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (6 - i), 1);
    const label = d.toLocaleString("en", { month: "short" });
    const year = d.getFullYear();
    const month = d.getMonth();

    const pts = allCampaigns
      .flatMap((c) => c.performancePoints)
      .filter((p) => {
        const pd = new Date(p.date);
        return pd.getFullYear() === year && pd.getMonth() === month;
      });

    return {
      name: label,
      expenses: pts.reduce((s, p) => s + Number(p.spend), 0),
    };
  });

  // ── Recent campaigns ─────────────────────────────────────────
  const recent = await prisma.campaign.findMany({
    where: { socialPage: { client: { adminId } } },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      performancePoints: true,
    },
  });

  const statusMap: Record<string, string> = { ACTIVE: "active", PAUSED: "paused", COMPLETED: "completed" };
  const platformMap: Record<string, string> = { META: "meta", TIKTOK: "tiktok", GOOGLE: "google" };

  const recentCampaigns = recent.map((c) => {
    const totalClicks = c.performancePoints.reduce((s, p) => s + p.clicks, 0);
    const totalImpressions = c.performancePoints.reduce((s, p) => s + p.impressions, 0);
    const performance = totalImpressions > 0 ? Math.min(Math.round((totalClicks / totalImpressions) * 1000), 100) : 0;

    return {
      id: c.id,
      name: c.name,
      platform: platformMap[c.platform] ?? "meta",
      budget: Number(c.budget),
      status: statusMap[c.status] ?? "paused",
      performance,
      date: c.startDate.toISOString().split("T")[0],
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      stats: [
        { key: "totalClients", value: totalClients, change: 0, trend: "up" },
        { key: "activeCampaigns", value: activeCampaigns, change: 0, trend: "up" },
        { key: "totalLeads", value: totalLeads, change: 0, trend: "up" },
        { key: "totalExpenses", value: Math.round(totalSpend), change: 0, trend: "up" },
      ],
      campaignPerformance,
      monthlyExpenses,
      recentCampaigns,
    },
  });
}
