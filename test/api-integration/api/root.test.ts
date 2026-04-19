import { afterAll, beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { createApiIntegrationTestEnvironment } from "../_support/test-environment";

const environment = createApiIntegrationTestEnvironment(new URL(import.meta.url).pathname);

describe("공개 API 통합 테스트", () => {
  beforeAll(async () => {
    await environment.setup();
  });

  beforeEach(async () => {
    await environment.reset();
  });

  afterAll(async () => {
    await environment.teardown();
  });

  test("GET /openapi.json 은 유효한 OpenAPI 문서를 반환한다", async () => {
    type OpenAPIResponse = {
      info: { title: string; version: string };
      openapi: string;
      paths: Record<string, unknown>;
    };

    const { json, response } = await environment.createClient().getJson<OpenAPIResponse>("/openapi.json");

    expect(response.status).toBe(200);
    expect(json.openapi).toBe("3.1.0");
    expect(json.info).toEqual({
      title: "결타래 API",
      version: "0.1.0",
    });
    expect(Object.keys(json.paths).some((path) => path.startsWith("/api/v1"))).toBe(true);
  });
});
