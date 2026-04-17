import { createContactMessageInputSchema } from "@gyeoltare/contracts";
import { Hono } from "hono";

import type { AppBindings } from "../../context";
import { jsonCreated, jsonValidationError } from "../../lib/http/json";
import { logInfo } from "../../lib/observability/logger";
import { createContactMessage } from "./service";

export function createContactMessagesRoutes() {
  const app = new Hono<AppBindings>();

  app.post("/", async (c) => {
    const input = await c.req.json().catch(() => null);
    const result = createContactMessageInputSchema.safeParse(input);

    if (!result.success) {
      return jsonValidationError(c, result.error.flatten());
    }

    const message = await createContactMessage(result.data);

    logInfo("contact_message.created", {
      id: message.id,
      requestId: c.get("requestId"),
      sessionRole: c.get("session").role,
    });

    return jsonCreated(c, message);
  });

  return app;
}
