import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  children,
  className,
}: ChartCardProps) {
  return (
    <DashboardCard className={cn("p-5 sm:p-6", className)}>
      <SectionHeader
        title={title}
        description={description}
        className="mb-6"
      />
      {children}
    </DashboardCard>
  );
}
