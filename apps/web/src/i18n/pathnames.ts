import { isLocale, type Locale } from "./config";

export function getLocalizedPath(locale: Locale, pathname = "/") {
  const normalizedPath = pathname === "/" ? "" : pathname;

  return `/${locale}${normalizedPath}`;
}

export function hasLocalePrefix(pathname: string) {
  const [, segment] = pathname.split("/");

  return isLocale(segment);
}

export function replaceLocaleInPathname(pathname: string, locale: Locale) {
  const segments = pathname.split("/");

  if (isLocale(segments[1])) {
    segments[1] = locale;

    return segments.join("/") || `/${locale}`;
  }

  return getLocalizedPath(locale, pathname);
}
