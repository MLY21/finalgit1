import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import type { DashboardOverview } from "@/types";

const emptyOverview: DashboardOverview = {
  stats: [
    { key: "totalClients", value: 0, change: 0, trend: "up" },
    { key: "activeCampaigns", value: 0, change: 0, trend: "up" },
    { key: "totalLeads", value: 0, change: 0, trend: "up" },
    { key: "totalExpenses", value: 0, change: 0, trend: "up" },
  ],
  campaignPerformance: [],
  monthlyExpenses: [],
  recentCampaigns: [],
};

export async function getDashboardOverview(): Promise<DashboardOverview> {
  try {
    const user = await getAuthUser();
    if (!user) return emptyOverview;

    const adminId = user.id;

    const totalClients = await prisma.client.count({ where: { adminId } });

    const allCampaigns = await prisma.campaign.findMany({
      where: { socialPage: { client: { adminId } } },
      include: { performancePoints: { orderBy: { date: "desc" } } },
    });

    const activeCampaigns = allCampaigns.filter((c) => c.status === "ACTIVE").length;
    const allPts = allCampaigns.flatMap((c) => c.performancePoints);
    const totalLeads = allPts.reduce((s, p) => s + p.messagesStarted, 0);
    const totalSpend = allPts.reduce((s, p) => s + Number(p.spend), 0);

    const today = new Date();

    const campaignPerformance = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dayStr = d.toISOString().split("T")[0];
      const pts = allPts.filter((p) => p.date.toISOString().split("T")[0] === dayStr);
      return {
        name: d.toLocaleString("en", { month: "short", day: "numeric" }),
        impressions: pts.reduce((s, p) => s + p.impressions, 0),
        clicks: pts.reduce((s, p) => s + p.clicks, 0),
        conversions: pts.reduce((s, p) => s + p.conversions, 0),
      };
    });

    const monthlyExpenses = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - (6 - i), 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const pts = allPts.filter((p) => {
        const pd = new Date(p.date);
        return pd.getFullYear() === year && pd.getMonth() === month;
      });
      return {
        name: d.toLocaleString("en", { month: "short" }),
        expenses: pts.reduce((s, p) => s + Number(p.spend), 0),
      };
    });

    const statusMap: Record<string, string> = { ACTIVE: "active", PAUSED: "paused", COMPLETED: "completed" };
    const platformMap: Record<string, string> = { META: "meta", TIKTOK: "tiktok", GOOGLE: "google" };

    const recent = allCampaigns
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 6);

    const recentCampaigns = recent.map((c) => {
      const pts = c.performancePoints;
      const totalClicks = pts.reduce((s, p) => s + p.clicks, 0);
      const totalImpressions = pts.reduce((s, p) => s + p.impressions, 0);
      const performance = totalImpressions > 0
        ? Math.min(Math.round((totalClicks / totalImpressions) * 1000), 100)
        : 0;
      return {
        id: c.id,
        name: c.name,
        platform: (platformMap[c.platform] ?? "meta") as "meta" | "tiktok" | "google",
        budget: Number(c.budget),
        status: (statusMap[c.status] ?? "paused") as "active" | "paused" | "completed",
        performance,
        date: c.startDate.toISOString().split("T")[0],
      };
    });

    return {
      stats: [
        { key: "totalClients", value: totalClients, change: 0, trend: "up" },
        { key: "activeCampaigns", value: activeCampaigns, change: 0, trend: "up" },
        { key: "totalLeads", value: totalLeads, change: 0, trend: "up" },
        { key: "totalExpenses", value: Math.round(totalSpend), change: 0, trend: "up" },
      ],
      campaignPerformance,
      monthlyExpenses,
      recentCampaigns,
    };
  } catch {
    return emptyOverview;
  }
}
