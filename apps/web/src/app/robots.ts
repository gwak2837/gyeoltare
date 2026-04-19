import type { MetadataRoute } from "next";

import { env } from "@/env";

const { WEB_ORIGIN } = env;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${WEB_ORIGIN}/sitemap.xml`,
  };
}
