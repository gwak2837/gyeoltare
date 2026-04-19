import type { MetadataRoute } from "next";

import { env } from "@/env";

const { WEB_ORIGIN } = env;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: WEB_ORIGIN,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
