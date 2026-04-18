import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import authRoutes from "./auth/routes";

const route = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            id: z.string(),
            age: z.number(),
            name: z.string(),
          }),
        },
      },
      description: "Retrieve the user",
    },
  },
});

const app = new OpenAPIHono();

app.openapi(route, (c) => {
  return c.json({
    id: "1",
    age: 20,
    name: "Ultra-man",
  });
});

app.route("/auth", authRoutes);

export default app;
