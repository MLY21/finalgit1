import { cn } from "@/lib/utils";

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function DashboardCard({
  children,
  className,
  hover = false,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-sm",
        hover &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
