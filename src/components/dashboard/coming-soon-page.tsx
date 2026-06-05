"use client";

import { PlaceholderPage } from "@/components/dashboard/placeholder-page";
import { useTranslations } from "@/providers/locale-provider";

interface ComingSoonPageProps {
  pageKey: "clients" | "campaigns" | "analytics" | "finance" | "notifications" | "settings";
}

export function ComingSoonPage({ pageKey }: ComingSoonPageProps) {
  const t = useTranslations();

  return (
    <PlaceholderPage
      title={t(`pages.${pageKey}.title`)}
      description={t(`pages.${pageKey}.description`)}
      comingSoonLabel={t("common.comingSoon")}
    />
  );
}
