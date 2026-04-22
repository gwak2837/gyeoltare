import { sec } from "@gyeoltare/util";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isProduction = process.env.NODE_ENV === "production";
const commitSHA = process.env.COMMIT_SHA;
const apiPort = process.env.API_PORT ?? "3001";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https:;
  worker-src 'self' blob:;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https: http:;
  object-src 'none';
  connect-src 'self' https: http:;
  frame-src 'self' https:;
  frame-ancestors 'none';
  ${isProduction ? "upgrade-insecure-requests;" : ""}
`;

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        {
          key: "Strict-Transport-Security",
          value: `max-age=${sec("2 years")}; includeSubDomains; preload`,
        },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        {
          key: "Content-Security-Policy",
          value: isProduction ? cspHeader.replace(/\s{2,}/g, " ").trim() : "",
        },
      ],
    },
    {
      source: "/sw.js",
      headers: [
        { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
      ],
    },
  ],

  output: "standalone",
  poweredByHeader: false,
  reactCompiler: true,
  transpilePackages: ["@gyeoltare/api", "@gyeoltare/api-client"],
  typedRoutes: true,

  ...(isProduction && {
    compiler: { removeConsole: { exclude: ["error", "warn"] } },
  }),
  ...(commitSHA && {
    deploymentId: commitSHA,
    generateBuildId: () => commitSHA,
  }),

  // NOTE: 로컬 개발 환경에선 포트가 달라 리버스 프록시가 필요해요.
  ...(!isProduction && {
    rewrites: async () => [
      {
        source: "/api/:path*",
        destination: `http://localhost:${apiPort}/api/:path*`,
      },
    ],
  }),
};

export default withNextIntl(nextConfig);
