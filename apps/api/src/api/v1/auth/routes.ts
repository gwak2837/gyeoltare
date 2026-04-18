import { Hono } from "hono";

import { handleAuthRequest } from "./auth";

const app = new Hono();

app.on(["GET", "POST"], "/*", (c) => {
  return handleAuthRequest(c.req.raw);
});

export default app;
