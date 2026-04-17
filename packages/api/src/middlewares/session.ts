import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";

export const sessionMiddleware: MiddlewareHandler = async (c, next) => {
  const sessionId = getCookie(c, "session") ?? null;

  c.set("session", {
    role: sessionId ? "member" : "anonymous",
    sessionId,
  });

  await next();
};
