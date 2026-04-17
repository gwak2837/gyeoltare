import { describe, expect, test } from "bun:test";

import { app } from "../../../apps/api/src/app";

describe("GET /api/health", () => {
  test(" ", async () => {
    const response = await app.request("/api/health");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      service: "api",
      status: "ok",
    });
  });
});
