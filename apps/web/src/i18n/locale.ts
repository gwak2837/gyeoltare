import { defaultLocale, isLocale } from "./config";

type Options = {
  acceptLanguage?: string | null;
  cookieLocale?: string | null;
};

export function resolveLocaleFromRequest({ acceptLanguage, cookieLocale }: Options) {
  return getLocaleFromCookie(cookieLocale) ?? getLocaleFromAcceptLanguage(acceptLanguage) ?? defaultLocale;
}

function normalizeLocale(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();

  if (normalized === "ko" || normalized.startsWith("ko-")) {
    return "ko";
  }
  if (normalized === "en" || normalized.startsWith("en-")) {
    return "en";
  }
  if (normalized === "ja" || normalized.startsWith("ja-")) {
    return "ja";
  }
  if (normalized === "zh" || normalized.startsWith("zh-")) {
    return "zh";
  }

  return null;
}

function getLocaleFromCookie(value: string | null | undefined) {
  return isLocale(value) ? value : normalizeLocale(value);
}

function getLocaleFromAcceptLanguage(header: string | null | undefined) {
  if (!header) {
    return null;
  }

  const candidates = header
    .split(",")
    .map((entry) => {
      const [languageRange, ...params] = entry.trim().split(";");
      const qValue = params.find((param) => param.trim().startsWith("q="));
      const weight = qValue ? Number.parseFloat(qValue.split("=")[1] ?? "1") : 1;

      return {
        languageRange,
        weight: Number.isFinite(weight) ? weight : 1,
      };
    })
    .sort((left, right) => right.weight - left.weight);

  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate.languageRange);

    if (locale) {
      return locale;
    }
  }

  return null;
}
