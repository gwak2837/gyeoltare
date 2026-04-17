import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/api-client", "@repo/contracts", "@repo/db"],
  typedRoutes: true,
};

export default nextConfig;
