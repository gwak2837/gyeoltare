import { createMiddleware } from "hono/factory";

import type { AppBindings } from "@/context";
import { authInstance } from "../api/v1/auth/auth";

export const authSessionMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const authSession = await authInstance.api.getSession({ headers: c.req.raw.headers });

  if (!authSession) {
    c.set("session", null);
    c.set("user", null);

    await next();
    return;
  }

  c.set("session", authSession.session);
  c.set("user", authSession.user);

  await next();
});
