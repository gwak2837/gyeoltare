import type { Metadata } from "next";

import { defaultLocale, locales, type Locale } from "./config";
import { getLocalizedPath } from "./pathnames";
import { env } from "@/lib/env";

function toAbsoluteUrl(pathname: string) {
  return new URL(pathname, env.NEXT_PUBLIC_SITE_URL).toString();
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
          locales.map((candidate) => [candidate, toAbsoluteUrl(getLocalizedPath(candidate, pathname))]),
        ),
        "x-default": toAbsoluteUrl(getLocalizedPath(defaultLocale, pathname)),
      },
    },
    description,
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title,
  };
}
