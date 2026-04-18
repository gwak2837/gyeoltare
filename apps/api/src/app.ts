import { ms } from "@gyeoltare/util";
import { httpInstrumentationMiddleware } from "@hono/otel";
import { Scalar } from "@scalar/hono-api-reference";
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
import { env } from "./env";
import { initializeOpenTelemetry, OTEL_SERVICE_NAME } from "./lib/observability/otel";
import { createOpenAPIApp, openApiDocumentConfig } from "./lib/openapi";
import { getDefaultSecureHeadersOptions, getDocsSecureHeadersOptions } from "./middlewares/secure-headers";
import { createContactMessagesRoutes } from "./modules/contact-messages/routes";
import { createHealthRoutes } from "./modules/health/routes";
import { createProfilesRoutes } from "./modules/profiles/routes";

const { WEB_ORIGIN } = env;

function createApp() {
  initializeOpenTelemetry();

  const app = createOpenAPIApp();

  // NOTE: 공통 미들웨어
  app.use(httpInstrumentationMiddleware({ serviceName: OTEL_SERVICE_NAME }));
  app.use("*", ipRestriction(getConnInfo, { denyList: [] }));
  app.use("*", requestId());
  app.use("*", etag());
  app.use("*", cors({ origin: WEB_ORIGIN, exposeHeaders: ["Retry-After"] }));
  app.use("*", timeout(ms("30 seconds")));
  app.use(logger());
  app.use(timing());
  app.use(compress());
  app.use(contextStorage());
  app.use(csrf({ origin: WEB_ORIGIN, secFetchSite: "same-site" }));
  app.doc31("/openapi.json", openApiDocumentConfig);
  app.get("/docs", Scalar({ pageTitle: "결타래 API", url: "/openapi.json" }));

  app.use(
    languageDetector({
      supportedLanguages: ["ko", "zh", "ja", "en"],
      fallbackLanguage: "ko",
    }),
  );

  app.use("*", async (c, next) => {
    if (c.req.path === "/docs") {
      return secureHeaders(getDocsSecureHeadersOptions())(c, next);
    }

    return secureHeaders(getDefaultSecureHeadersOptions())(c, next);
  });

  app.route("/api/health", createHealthRoutes());

  app.notFound((c) => {
    return c.json({}, 404);
  });

  app.onError((_error, c) => {
    return c.json({}, 500);
  });

  const apiV1 = createOpenAPIApp();

  apiV1.route("/contact-messages", createContactMessagesRoutes());
  apiV1.route("/profiles", createProfilesRoutes());

  app.route("/api/v1", apiV1);

  return app;
}

export const app = createApp();

export type AppType = typeof app;
