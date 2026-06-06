"use client";

import {
  Megaphone,
  Receipt,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { StatCard } from "@/components/dashboard/stat-card";
import { formatCurrency, formatPercentage } from "@/lib/format";
import { useLocale, useTranslations } from "@/providers/locale-provider";
import type { StatCardData, StatKey } from "@/types";

const statIcons: Record<StatKey, LucideIcon> = {
  totalClients: Users,
  activeCampaigns: Megaphone,
  totalLeads: Target,
  totalExpenses: Receipt,
};

const statAccents: Record<StatKey, "green" | "blue" | "purple" | "orange"> = {
  totalClients: "purple",
  activeCampaigns: "blue",
  totalLeads: "green",
  totalExpenses: "orange",
};

interface StatsCardsProps {
  stats: StatCardData[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  const t = useTranslations();
  const { locale } = useLocale();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = statIcons[stat.key];
        const isCurrency = stat.key === "totalExpenses";

        const displayValue = isCurrency
          ? formatCurrency(Number(stat.value), locale)
          : String(stat.value);

        const cardElement = (
          <StatCard
            title={t(`stats.${stat.key}`)}
            value={displayValue}
            change={formatPercentage(stat.change, locale)}
            trend={stat.trend}
            icon={Icon}
            comparisonLabel={t("dashboard.vsLastMonth")}
            accent={statAccents[stat.key]}
          />
        );

        if (stat.key === "totalClients") {
          return (
            <Link
              key={stat.key}
              href="/dashboard/clients"
              className="block cursor-pointer focus:outline-none transition-transform active:scale-[0.99]"
            >
              {cardElement}
            </Link>
          );
        }

        if (stat.key === "activeCampaigns") {
          return (
            <Link
              key={stat.key}
              href="/dashboard/campaigns"
              className="block cursor-pointer focus:outline-none transition-transform active:scale-[0.99]"
            >
              {cardElement}
            </Link>
          );
        }

        return <div key={stat.key}>{cardElement}</div>;
      })}
    </div>
  );
}
