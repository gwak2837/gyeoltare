import { Hono } from "hono";

import type { AppBindings } from "../../context";
import { jsonOk } from "../../lib/http/json";
import { buildHealthStatus } from "./service";

export function createHealthRoutes() {
  const app = new Hono<AppBindings>();

  app.get("/", (c) => {
    return jsonOk(c, buildHealthStatus());
  });

  return app;
}
