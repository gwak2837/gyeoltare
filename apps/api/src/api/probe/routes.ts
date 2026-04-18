import { ms } from "@gyeoltare/util";
import type { OpenAPIHono } from "@hono/zod-openapi";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { timeout } from "hono/timeout";
import { getLiveResponse, getReadyResponse, getStartupResponse } from "./service";

function respondWithProbe(c: Context, body: unknown, statusCode: 200 | 503) {
  c.header("Cache-Control", "no-store");

  return c.json(body, statusCode);
}

export function registerProbeRoutes(app: OpenAPIHono) {
  app.get("/api/live", (c) => {
    const { body, statusCode } = getLiveResponse();

    return respondWithProbe(c, body, statusCode);
  });

  app.use("/api/ready", timeout(ms("1 second"), new HTTPException(503, { message: "Service Unavailable" })));

  app.get("/api/ready", async (c) => {
    const { body, statusCode } = await getReadyResponse();

    return respondWithProbe(c, body, statusCode);
  });

  app.get("/api/startup", (c) => {
    const { body, statusCode } = getStartupResponse();

    return respondWithProbe(c, body, statusCode);
  });
}
