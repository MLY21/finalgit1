"use client";

import { useMemo } from "react";

import { navigationItems } from "@/lib/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useTranslations } from "@/providers/locale-provider";

export function useNavigation() {
  const { hasPermission } = useAuth();
  const t = useTranslations();

  return useMemo(
    () =>
      navigationItems
        .filter((item) => hasPermission(item.permission))
        .map((item) => ({
          ...item,
          title: t(`nav.${item.key}`),
        })),
    [hasPermission, t]
  );
}
