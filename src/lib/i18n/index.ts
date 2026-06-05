import type { Locale } from "@/lib/i18n/config";

import en from "@/messages/en.json";

export type Messages = typeof en;

const messages: Record<Locale, Messages> = { en };

export function getMessages(locale: Locale = "en"): Messages {
  return messages[locale] ?? messages.en;
}

export function translate(messages: Messages, key: string): string {
  const keys = key.split(".");
  let value: unknown = messages;

  for (const segment of keys) {
    if (value && typeof value === "object" && segment in value) {
      value = (value as Record<string, unknown>)[segment];
    } else {
      return key;
    }
  }

  return typeof value === "string" ? value : key;
}
