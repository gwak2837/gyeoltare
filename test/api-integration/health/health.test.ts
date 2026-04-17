import { describe, expect, test } from "bun:test";

import { createApp } from "../../../packages/api/src";

describe("GET /api/health", () => {
  test(" ", async () => {
    const app = createApp();
    const response = await app.request("/api/health");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      service: "api",
      status: "ok",
    });
  });
});
