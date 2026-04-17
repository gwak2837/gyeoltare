import { apiErrorSchema, openApiDocument } from "@gyeoltare/contracts";
import { Hono } from "hono";

import type { AppBindings } from "./context";
import { HttpError } from "./lib/errors/http-error";
import { logError } from "./lib/observability/logger";
import { requestIdMiddleware } from "./middlewares/request-id";
import { sessionMiddleware } from "./middlewares/session";
import { createContactMessagesRoutes } from "./modules/contact-messages/routes";
import { createHealthRoutes } from "./modules/health/routes";
import { createProfilesRoutes } from "./modules/profiles/routes";

export function createApp() {
  const app = new Hono<AppBindings>();
  const apiV1 = new Hono<AppBindings>();

  app.use("*", requestIdMiddleware);
  app.use("*", sessionMiddleware);

  app.get("/openapi.json", (c) => c.json(openApiDocument));
  app.route("/api/health", createHealthRoutes());

  apiV1.route("/contact-messages", createContactMessagesRoutes());
  apiV1.route("/profiles", createProfilesRoutes());

  app.route("/api/v1", apiV1);

  app.notFound((c) => {
    return c.json(
      apiErrorSchema.parse({
        code: "not_found",
        message: "The requested resource could not be found.",
        requestId: c.get("requestId"),
      }),
      404,
    );
  });

  app.onError((error, c) => {
    if (error instanceof HttpError) {
      const body = apiErrorSchema.parse({
        code: error.code,
        details: error.details,
        message: error.message,
        requestId: c.get("requestId"),
      });

      return new Response(JSON.stringify(body), {
        headers: {
          "content-type": "application/json",
        },
        status: error.status,
      });
    }

    logError("api.unhandled_error", {
      message: error.message,
      requestId: c.get("requestId"),
    });

    return c.json(
      apiErrorSchema.parse({
        code: "internal_error",
        message: "An unexpected error occurred.",
        requestId: c.get("requestId"),
      }),
      500,
    );
  });

  return app;
}

export type AppType = ReturnType<typeof createApp>;
