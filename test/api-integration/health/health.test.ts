import { describe, expect, it } from "bun:test";

import { createApp } from "../../../packages/api/src";

describe("GET /api/healthz", () => {
  it("returns the API health payload", async () => {
    const app = createApp();
    const response = await app.request("/api/healthz");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      service: "api",
      status: "ok",
    });
  });
});
