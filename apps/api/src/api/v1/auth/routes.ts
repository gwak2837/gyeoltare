import { Hono } from "hono";

import { authInstance } from "./auth";

const app = new Hono();

app.on(["GET", "POST"], "/*", (c) => {
  return authInstance.handler(c.req.raw);
});

export default app;
