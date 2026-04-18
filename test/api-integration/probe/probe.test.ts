import { describe, expect, test } from "bun:test";

import { app } from "../../../apps/api/src/app";

describe("API probe routes", () => {
  test("returns startup success once bootstrapped", async () => {
    const response = await app.request("/api/startup");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      probe: "startup",
      status: "ok",
    });
  });

  test("keeps liveness green", async () => {
    const response = await app.request("/api/live");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      probe: "live",
      status: "ok",
    });
  });
});
