import { afterAll, beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { createHttpClient } from "../_support/http-client";
import { startApiServer } from "../_support/server";
import { createApiIntegrationTestEnvironment } from "../_support/test-environment";

const environment = createApiIntegrationTestEnvironment(new URL(import.meta.url).pathname);

describe("API 프로브 통합 테스트", () => {
  beforeAll(async () => {
    await environment.setup();
  });

  beforeEach(async () => {
    await environment.reset();
  });

  afterAll(async () => {
    await environment.teardown();
  });

  test("GET /api/live 는 200을 반환하고 캐시를 비활성화한다", async () => {
    const response = await environment.createClient().get("/api/live");

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({
      probe: "live",
      status: "ok",
    });
  });

  test("GET /api/startup 은 서버 기동 후 200을 반환한다", async () => {
    const response = await environment.createClient().get("/api/startup");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      probe: "startup",
      status: "ok",
    });
  });

  test("GET /api/ready 는 PostgreSQL 연결이 가능할 때 200을 반환한다", async () => {
    const response = await environment.createClient().get("/api/ready");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      probe: "ready",
      status: "ok",
    });
  });

  test("GET /api/ready 는 PostgreSQL 연결이 불가능할 때 503을 반환한다", async () => {
    const server = await startApiServer({
      databaseUrl: "postgresql://postgres:postgres@127.0.0.1:1/unreachable",
      label: "api-integration:ready-unreachable-db",
      waitUntilReady: false,
    });

    try {
      const client = createHttpClient({ baseUrl: server.baseUrl });
      const response = await client.get("/api/ready");

      expect(response.status).toBe(503);
      expect(await response.json()).toEqual({
        probe: "ready",
        status: "error",
      });
    } finally {
      await server.stop();
    }
  });
});
