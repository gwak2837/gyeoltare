import { createRoute } from "@hono/zod-openapi";

import { createOpenAPIApp, openApiErrorSchema } from "../../lib/openapi";
import { listProfilesQuerySchema, listProfilesResponseSchema } from "./schema";
import { listPublicProfiles } from "./service";

const listProfilesRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: listProfilesQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: listProfilesResponseSchema,
        },
      },
      description: "List of public profiles",
    },
    422: {
      content: {
        "application/json": {
          schema: openApiErrorSchema,
        },
      },
      description: "Validation error",
    },
  },
  summary: "List public profiles",
  tags: ["Profiles"],
});

export function createProfilesRoutes() {
  const app = createOpenAPIApp();

  app.openapi(listProfilesRoute, async (c) => {
    const query = c.req.valid("query");
    const payload = await listPublicProfiles(query);
    return c.json(payload, 200);
  });

  return app;
}
