import type { Locale } from "@/lib/i18n/config";
import { localeConfig } from "@/lib/i18n/config";

export function formatCurrency(
  amount: number,
  locale: Locale = "en",
  currency = localeConfig.en.currency
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string, locale: Locale = "en") {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatPercentage(value: number, locale: Locale = "en") {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(Math.abs(value));

  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatted}%`;
}

export function formatCompactCurrency(
  amount: number,
  locale: Locale = "en",
  currency = localeConfig.en.currency
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export const CLIENT_CURRENCY = "LYD";

export function formatLyd(amount: number, options?: { compact?: boolean }) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CLIENT_CURRENCY,
    notation: options?.compact ? "compact" : "standard",
    maximumFractionDigits: options?.compact ? 1 : 0,
  }).format(amount);
}

export function formatNumber(value: number, options?: { compact?: boolean }) {
  return new Intl.NumberFormat("en-US", {
    notation: options?.compact ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}
