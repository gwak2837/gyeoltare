import { describe, expect, it } from "vitest";

import { buildHealthStatus } from "./service";

describe("buildHealthStatus", () => {
  it("returns the canonical api health payload", () => {
    const payload = buildHealthStatus();

    expect(payload.service).toBe("api");
    expect(payload.status).toBe("ok");
  });
});
