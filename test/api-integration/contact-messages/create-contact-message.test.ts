import { afterAll, beforeAll, describe, expect, it } from "bun:test";

import { createApp } from "../../../packages/api/src";
import { getDb } from "../../../packages/db/src/client";
import { contactMessages } from "../../../packages/db/src/schema";
import {
  type PostgresTestDatabase,
  startPostgresTestDatabase,
  stopPostgresTestDatabase,
} from "../helpers/test-database";

describe("POST /api/v1/contact-messages", () => {
  let database: PostgresTestDatabase | undefined;
  let runtimeUnavailableReason: string | null = null;

  beforeAll(async () => {
    try {
      database = await startPostgresTestDatabase();
    } catch (error) {
      runtimeUnavailableReason =
        error instanceof Error ? error.message : "Container runtime is unavailable.";
      console.warn(`[integration] skipping contact-messages test: ${runtimeUnavailableReason}`);
    }
  });

  afterAll(async () => {
    await stopPostgresTestDatabase(database);
  });

  it("creates a contact message through the Hono mutation path", async () => {
    if (!database) {
      return;
    }

    const app = createApp();
    const response = await app.request("/api/v1/contact-messages", {
      body: JSON.stringify({
        company: "gyeoltare",
        email: "team@gyeoltare.dev",
        message: "이 메시지는 write-via-Hono 경계를 검증하기 위한 통합 테스트입니다.",
        name: "Operations Team",
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    const body = await response.json();
    const db = getDb();
    const rows = await db.select().from(contactMessages);

    expect(response.status).toBe(201);
    expect(body.email).toBe("team@gyeoltare.dev");
    expect(rows).toHaveLength(1);
    expect(rows[0]?.email).toBe("team@gyeoltare.dev");
  });
});
