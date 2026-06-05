import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ClientStatusBadge({ status }: { status: "active" | "inactive" | "pending" }) {
  const styles = {
    active: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400",
    inactive: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400",
    pending: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400",
  };

  return (
    <Badge
      variant="outline"
      className={cn("rounded-lg font-medium capitalize px-2 py-0.5 text-xs", styles[status])}
    >
      {status}
    </Badge>
  );
}
