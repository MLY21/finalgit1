import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionNavigation } from "@/components/dashboard/analytics/section-navigation";
import { BestPerformingCampaign } from "@/components/dashboard/analytics/best-performing-campaign";
import { LeadsAnalysis } from "@/components/dashboard/analytics/leads-analysis";
import { PlatformInsights } from "@/components/dashboard/analytics/platform-insights";
import { InsightsSummary } from "@/components/dashboard/analytics/insights-summary";
import {
  campaignInsights,
  leadAnalysis,
  insightsSummary,
} from "@/data/analytics";

const platformInsightsData = [
  {
    title: "Best Performing Platform",
    value: "Meta Ads generated 68% of all leads",
    type: "best" as const,
  },
  {
    title: "Highest Lead Generation",
    value: "Meta Ads with 848 leads",
    type: "highest" as const,
  },
  {
    title: "Most Active Platform",
    value: "Meta Ads with highest click volume",
    type: "most" as const,
  },
  {
    title: "Highest Click Volume",
    value: "Meta Ads with 38,500 clicks",
    type: "most" as const,
  },
];

const navigationSections = [
  { id: "best-campaign", label: "Best Campaign" },
  { id: "leads-analysis", label: "Leads Analysis" },
  { id: "platform-insights", label: "Platform Insights" },
  { id: "insights-summary", label: "Insights Summary" },
];

export default function CampaignInsightsPage() {
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <PageHeader
        title="Campaign Insights"
        description="Deeper campaign-level analysis and performance comparisons."
      />

      {/* Section Navigation */}
      <SectionNavigation sections={navigationSections} />

      {/* Best Performing Campaign */}
      <div id="best-campaign">
        <DashboardCard className="p-4 sm:p-5">
          <BestPerformingCampaign campaign={campaignInsights[0]} />
        </DashboardCard>
      </div>

      {/* Leads Analysis */}
      <div id="leads-analysis">
        <DashboardCard className="p-4 sm:p-5">
          <LeadsAnalysis data={leadAnalysis} />
        </DashboardCard>
      </div>

      {/* Platform Insights */}
      <div id="platform-insights">
        <DashboardCard className="p-4 sm:p-5">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Platform Insights
          </h3>
          <PlatformInsights insights={platformInsightsData} />
        </DashboardCard>
      </div>

      {/* Insights Summary */}
      <div id="insights-summary">
        <DashboardCard className="p-4 sm:p-5">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Insights Summary
          </h3>
          <InsightsSummary insights={insightsSummary} />
        </DashboardCard>
      </div>
    </div>
  );
}
