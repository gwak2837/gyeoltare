import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@gyeoltare/api-client", "@gyeoltare/contracts", "@gyeoltare/db"],
  typedRoutes: true,
};

export default withNextIntl(nextConfig);
