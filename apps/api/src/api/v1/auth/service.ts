import { createMiddleware } from "hono/factory";

import type { AppBindings } from "../../../context";
import { getAuthSession } from "./auth";

export const authSessionMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const authSession = await getAuthSession(c.req.raw.headers);

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
