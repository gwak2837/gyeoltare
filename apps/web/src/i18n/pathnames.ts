import type { Route } from "next";
import { isLocale, type Locale } from "./config";

export function getLocalizedPath(locale: Locale, pathname = "/") {
  const normalizedPath = pathname === "/" ? "" : pathname;

  return `/${locale}${normalizedPath}` as Route;
}

export function hasLocalePrefix(pathname: string) {
  const [, segment] = pathname.split("/");

  return isLocale(segment);
}
