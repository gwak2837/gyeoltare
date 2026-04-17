import { defaultLocale, isLocale, type Locale } from "./config";

function normalizeLocaleCandidate(value: string | null | undefined): Locale | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.toLowerCase();

  if (normalized === "ko" || normalized.startsWith("ko-")) {
    return "ko";
  }

  if (normalized === "en" || normalized.startsWith("en-")) {
    return "en";
  }

  return undefined;
}

export function getLocaleFromCookie(value: string | null | undefined) {
  return isLocale(value) ? value : normalizeLocaleCandidate(value);
}

export function getLocaleFromAcceptLanguage(header: string | null | undefined): Locale | undefined {
  if (!header) {
    return undefined;
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
    const locale = normalizeLocaleCandidate(candidate.languageRange);

    if (locale) {
      return locale;
    }
  }

  return undefined;
}

export function resolveLocaleFromRequestValues({
  acceptLanguage,
  cookieLocale,
}: {
  acceptLanguage?: string | null;
  cookieLocale?: string | null;
}): Locale {
  return (
    getLocaleFromCookie(cookieLocale) ??
    getLocaleFromAcceptLanguage(acceptLanguage) ??
    defaultLocale
  );
}
