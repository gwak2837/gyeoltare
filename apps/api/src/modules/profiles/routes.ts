import { listProfilesQuerySchema } from "@gyeoltare/contracts/profiles";
import { Hono } from "hono";

import type { AppBindings } from "../../context";
import { jsonOk, jsonValidationError } from "../../lib/http/json";
import { listPublicProfiles } from "./service";

export function createProfilesRoutes() {
  const app = new Hono<AppBindings>();

  app.get("/", async (c) => {
    const result = listProfilesQuerySchema.safeParse({
      limit: c.req.query("limit"),
    });

    if (!result.success) {
      return jsonValidationError(c, result.error.flatten());
    }

    const payload = await listPublicProfiles(result.data);
    return jsonOk(c, payload);
  });

  return app;
}
