import { env } from "@/env";
import { defaultLocale, type Locale, locales } from "./config";
import { getLocalizedPath } from "./pathnames";

const { WEB_ORIGIN } = env;

type Options = {
  description: string;
  locale: Locale;
  pathname: string;
  title: string;
};

export async function buildLocalizedMetadata({ description, locale, pathname, title }: Options) {
  const languageEntries = locales.map((locale) => [locale, toAbsoluteUrl(getLocalizedPath(locale, pathname))]);

  return {
    alternates: {
      canonical: toAbsoluteUrl(getLocalizedPath(locale, pathname)),
      languages: {
        ...Object.fromEntries(languageEntries),
        "x-default": toAbsoluteUrl(getLocalizedPath(defaultLocale, pathname)),
      },
    },
    description,
    metadataBase: new URL(WEB_ORIGIN),
    title,
  };
}

function toAbsoluteUrl(pathname: string) {
  return new URL(pathname, WEB_ORIGIN).toString();
}
