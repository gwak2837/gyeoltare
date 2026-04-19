import { Hono } from "hono";

import { auth } from "./auth";

const app = new Hono();

app.on(["GET", "POST"], "/*", (c) => {
  return auth.handler(c.req.raw);
});

export default app;
