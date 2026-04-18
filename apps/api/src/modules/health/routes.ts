import { createRoute } from "@hono/zod-openapi";
import { createOpenAPIApp } from "../../lib/openapi";
import { healthStatusSchema } from "./schema";
import { buildHealthStatus } from "./service";

const getHealthRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: healthStatusSchema,
        },
      },
      description: "API health status",
    },
  },
  summary: "Health check",
  tags: ["Health"],
});

export function createHealthRoutes() {
  const app = createOpenAPIApp();

  app.openapi(getHealthRoute, (c) => {
    return c.json(buildHealthStatus(), 200);
  });

  return app;
}
