import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";

const app = new OpenAPIHono();

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

app.openapi(route, (c) => {
  return c.json({
    id: "1",
    age: 20,
    name: "Ultra-man",
  });
});

export default app;
