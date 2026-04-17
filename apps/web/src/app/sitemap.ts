import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";
import { env } from "@/lib/env";

const localizedRoutes = ["/", "/dashboard"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    localizedRoutes.map((pathname) => ({
      changeFrequency: pathname === "/" ? "weekly" : "daily",
      lastModified: new Date(),
      priority: pathname === "/" ? 1 : 0.7,
      url: new URL(getLocalizedPath(locale, pathname), env.NEXT_PUBLIC_WEB_ORIGIN).toString(),
    })),
  );
}
