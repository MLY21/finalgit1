import type { LucideIcon } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";

interface ClientStatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export function ClientStatCard({
  title,
  value,
  description,
  icon: Icon,
}: ClientStatCardProps) {
  return (
    <DashboardCard hover className="group p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {value}
          </p>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-zinc-900 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900">
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </DashboardCard>
  );
}
