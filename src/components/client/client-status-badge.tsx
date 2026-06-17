import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ClientStatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400",
  paused:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400",
  completed:
    "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  archived:
    "border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  archived: "Archived",
};

export function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
  const key = status?.toLowerCase() ?? "";
  return (
    <Badge
      variant="outline"
      className={cn("rounded-lg font-medium", statusStyles[key] ?? statusStyles.completed)}
    >
      {statusLabels[key] ?? status}
    </Badge>
  );
}
