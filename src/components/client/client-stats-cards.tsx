import {
  Activity,
  CreditCard,
  Megaphone,
  PiggyBank,
  Target,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { ClientStatCard } from "@/components/client/client-stat-card";
import { formatLyd, formatNumber } from "@/lib/format";
import type { ClientStat, ClientStatKey } from "@/types/client";

const statMeta: Record<ClientStatKey, { label: string; icon: LucideIcon }> = {
  myCampaigns: { label: "My Campaigns", icon: Megaphone },
  activeCampaigns: { label: "Active Campaigns", icon: Activity },
  totalBudget: { label: "Total Budget", icon: Wallet },
  totalSpent: { label: "Total Spent", icon: CreditCard },
  remainingBudget: { label: "Remaining Budget", icon: PiggyBank },
  totalLeads: { label: "Total Leads", icon: Target },
};

export function ClientStatsCards({ stats }: { stats: ClientStat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const meta = statMeta[stat.key];
        const value =
          stat.format === "currency"
            ? formatLyd(stat.value)
            : formatNumber(stat.value);

        return (
          <ClientStatCard
            key={stat.key}
            title={meta.label}
            value={value}
            description={stat.description}
            icon={meta.icon}
          />
        );
      })}
    </div>
  );
}
