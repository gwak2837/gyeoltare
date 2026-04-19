export type Locale = (typeof locales)[number];

export const locales = ["ko", "en", "ja", "zh"] as const;
export const defaultLocale: Locale = "ko";
export const localeCookieName = "NEXT_LOCALE";

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function toIntlLocale(locale: Locale) {
  switch (locale) {
    case "ko":
      return "ko-KR";
    case "en":
      return "en-US";
    case "ja":
      return "ja-JP";
    case "zh":
      return "zh-CN";
    default:
      return "ko-KR";
  }
}
