import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";

interface PlaceholderPageProps {
  title: string;
  description: string;
  comingSoonLabel: string;
}

export function PlaceholderPage({
  title,
  description,
  comingSoonLabel,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <DashboardCard className="flex min-h-[320px] items-center justify-center p-8">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {comingSoonLabel}
        </p>
      </DashboardCard>
    </div>
  );
}
