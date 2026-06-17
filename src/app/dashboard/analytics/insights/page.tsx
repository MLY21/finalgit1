"use client";

import { useEffect, useState } from "react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionNavigation } from "@/components/dashboard/analytics/section-navigation";
import { BestPerformingCampaign } from "@/components/dashboard/analytics/best-performing-campaign";
import { PlatformInsights } from "@/components/dashboard/analytics/platform-insights";
import { Database } from "lucide-react";

const navigationSections = [
  { id: "best-campaign", label: "Best Campaign" },
  { id: "platform-insights", label: "Platform Insights" },
];

export default function CampaignInsightsPage() {
  const [topCampaign, setTopCampaign] = useState<any>(null);
  const [platformData, setPlatformData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/analytics/campaigns?sortBy=spend&limit=1").then((r) => r.json()),
      fetch("/api/analytics/platform-performance").then((r) => r.json()),
    ])
      .then(([campaignsRes, platformRes]) => {
        if (campaignsRes.success && campaignsRes.data.length > 0) {
          const c = campaignsRes.data[0];
          setTopCampaign({
            id: c.id,
            name: c.name,
            client: c.clientName ?? "Unlinked",
            platform: c.platform,
            views: c.impressions ?? 0,
            clicks: c.clicks ?? 0,
            leads: c.messagesStarted ?? 0,
            adSpend: c.spend ?? 0,
            conversionRate: c.ctr ? Number(c.ctr) * 100 : 0,
          });
        }
        if (platformRes.success) setPlatformData(platformRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-5">
        <PageHeader title="Campaign Insights" description="Deeper campaign-level analysis and performance comparisons." />
        <div className="flex items-center justify-center h-96 text-zinc-400">Loading insights...</div>
      </div>
    );
  }

  if (!topCampaign) {
    return (
      <div className="space-y-5">
        <PageHeader title="Campaign Insights" description="Deeper campaign-level analysis and performance comparisons." />
        <DashboardCard className="flex flex-col items-center justify-center gap-4 py-20">
          <Database className="size-12 text-zinc-300 dark:text-zinc-600" />
          <div className="text-center">
            <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">No campaign insights available yet.</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Import campaigns from Facebook to view insights.</p>
          </div>
        </DashboardCard>
      </div>
    );
  }

  const platformInsightsData = platformData.map((p: any) => ({
    title: `${p.platform} Performance`,
    value: `${p.platform} — ${p.messagesStarted ?? 0} messages, ${p.clickThroughRate ? (p.clickThroughRate * 100).toFixed(2) : "0.00"}% CTR`,
    type: "best" as const,
  }));

  return (
    <div className="space-y-5">
      <PageHeader title="Campaign Insights" description="Deeper campaign-level analysis and performance comparisons." />
      <SectionNavigation sections={navigationSections} />

      <div id="best-campaign">
        <DashboardCard className="p-4 sm:p-5">
          <BestPerformingCampaign campaign={topCampaign} />
        </DashboardCard>
      </div>

      <div id="platform-insights">
        <DashboardCard className="p-4 sm:p-5">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Platform Insights</h3>
          <PlatformInsights insights={platformInsightsData} />
        </DashboardCard>
      </div>
    </div>
  );
}
