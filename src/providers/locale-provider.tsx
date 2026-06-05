"use client";

import { createContext, useContext, useMemo } from "react";

import { defaultLocale, localeConfig } from "@/lib/i18n/config";
import { getMessages, translate, type Messages } from "@/lib/i18n";

interface LocaleContextValue {
  locale: typeof defaultLocale;
  dir: "ltr";
  messages: Messages;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const messages = useMemo(() => getMessages(defaultLocale), []);

  const t = useMemo(
    () => (key: string) => translate(messages, key),
    [messages]
  );

  const value = useMemo(
    () => ({
      locale: defaultLocale,
      dir: "ltr" as const,
      messages,
      t,
    }),
    [messages, t]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }

  return context;
}

export function useTranslations() {
  return useLocale().t;
}
