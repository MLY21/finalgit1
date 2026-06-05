export type Locale = "en";

export const defaultLocale: Locale = "en";

export const localeConfig: Record<
  Locale,
  { label: string; dir: "ltr" | "rtl"; currency: string }
> = {
  en: { label: "English", dir: "ltr", currency: "USD" },
};
