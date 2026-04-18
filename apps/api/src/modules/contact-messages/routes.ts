import { createRoute } from "@hono/zod-openapi";
import { createOpenAPIApp, openApiErrorSchema } from "../../lib/openapi";
import { contactMessageSchema, createContactMessageInputSchema } from "./schema";
import { createContactMessage } from "./service";

const createContactMessageRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createContactMessageInputSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: contactMessageSchema,
        },
      },
      description: "Contact message created",
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
  summary: "Create a contact message",
  tags: ["Contact Messages"],
});

export function createContactMessagesRoutes() {
  const app = createOpenAPIApp();

  app.openapi(createContactMessageRoute, async (c) => {
    const input = c.req.valid("json");
    const message = await createContactMessage(input);

    console.info("contact_message.created", {
      id: message.id,
      requestId: c.get("requestId"),
    });

    return c.json(message, 201);
  });

  return app;
}
