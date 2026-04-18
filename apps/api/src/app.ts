import { ms } from "@gyeoltare/util";
import { httpInstrumentationMiddleware } from "@hono/otel";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { getConnInfo } from "hono/bun";
import { compress } from "hono/compress";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { etag } from "hono/etag";
import { ipRestriction } from "hono/ip-restriction";
import { languageDetector } from "hono/language";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { timeout } from "hono/timeout";
import { timing } from "hono/timing";
import { registerProbeRoutes } from "./api/probe/routes";
import { markStartupComplete } from "./api/probe/service";
import apiV1 from "./api/v1";
import { authSessionMiddleware } from "./api/v1/auth/service";
import { env } from "./env";
import { initializeOpenTelemetry, OTEL_SERVICE_NAME } from "./lib/observability/otel";
import { getDefaultSecureHeadersOptions, getDocsSecureHeadersOptions } from "./middlewares/secure-headers";

const openAPIConfigure = {
  openapi: "3.1.0",
  info: {
    title: "결타래 API",
    version: "0.1.0",
  },
};

const openAPIPath = "/openapi.json";

function createRootApp() {
  initializeOpenTelemetry();

  const app = new OpenAPIHono();

  registerProbeRoutes(app);

  app.use(httpInstrumentationMiddleware({ serviceName: OTEL_SERVICE_NAME }));
  app.use("*", ipRestriction(getConnInfo, { denyList: [] }));
  app.use("*", requestId());
  app.use("*", etag());
  app.use("*", cors({ origin: env.WEB_ORIGIN, exposeHeaders: ["Retry-After"] }));
  app.use("*", timeout(ms("30 seconds")));
  app.use(logger());
  app.use(timing());
  app.use(compress());
  app.use(contextStorage());
  app.use(csrf({ origin: env.WEB_ORIGIN, secFetchSite: "same-site" }));
  app.get("/scalar", Scalar({ url: openAPIPath }));
  app.doc31(openAPIPath, openAPIConfigure);

  app.use(
    languageDetector({
      supportedLanguages: ["ko", "zh", "ja", "en"],
      fallbackLanguage: "ko",
    }),
  );

  app.use("*", async (c, next) => {
    if (c.req.path === "/scalar" || c.req.path === "/api/v1/auth/reference") {
      return secureHeaders(getDocsSecureHeadersOptions())(c, next);
    }

    return secureHeaders(getDefaultSecureHeadersOptions())(c, next);
  });

  app.get("/llms.txt", async (c) => {
    const content = app.getOpenAPI31Document(openAPIConfigure);
    const markdown = await createMarkdownFromOpenApi(JSON.stringify(content));

    return c.text(markdown);
  });

  app.use("/api/v1/*", authSessionMiddleware);
  app.route("/api/v1", apiV1);

  markStartupComplete();

  return app;
}

export const app = createRootApp();

export type AppType = typeof app;
