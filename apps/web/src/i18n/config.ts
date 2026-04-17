export const locales = ["ko", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";
export const localeCookieName = "NEXT_LOCALE";

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function toIntlLocale(locale: Locale) {
  return locale === "ko" ? "ko-KR" : "en-US";
}
