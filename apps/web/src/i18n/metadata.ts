import type { Metadata } from "next";
import { env } from "@/lib/env";
import { defaultLocale, type Locale, locales } from "./config";
import { getLocalizedPath } from "./pathnames";

function toAbsoluteUrl(pathname: string) {
  return new URL(pathname, env.NEXT_PUBLIC_WEB_ORIGIN).toString();
}

export function buildLocalizedMetadata({
  description,
  locale,
  pathname,
  title,
}: {
  description: string;
  locale: Locale;
  pathname: string;
  title: string;
}): Metadata {
  return {
    alternates: {
      canonical: toAbsoluteUrl(getLocalizedPath(locale, pathname)),
      languages: {
        ...Object.fromEntries(
          locales.map((candidate) => [
            candidate,
            toAbsoluteUrl(getLocalizedPath(candidate, pathname)),
          ]),
        ),
        "x-default": toAbsoluteUrl(getLocalizedPath(defaultLocale, pathname)),
      },
    },
    description,
    metadataBase: new URL(env.NEXT_PUBLIC_WEB_ORIGIN),
    title,
  };
}
