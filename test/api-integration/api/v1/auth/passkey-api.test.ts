import { afterAll, beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { createEmailPasswordUser } from "../../../_support/auth-fixtures";
import { createApiIntegrationTestEnvironment } from "../../../_support/test-environment";

const environment = createApiIntegrationTestEnvironment(new URL(import.meta.url).pathname);

describe("패스키 API 계약 통합 테스트", () => {
  beforeAll(async () => {
    await environment.setup();
  });

  beforeEach(async () => {
    await environment.reset();
  });

  afterAll(async () => {
    await environment.teardown();
  });

  test("비인증 사용자는 패스키 등록 옵션을 생성할 수 없다", async () => {
    const client = environment.createClient();

    const response = await client.get("/api/v1/auth/passkey/generate-register-options");

    expect(response.ok).toBe(false);
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  test("challenge 없이 verify-registration 을 호출하면 실패한다", async () => {
    const client = environment.createClient();
    const user = createEmailPasswordUser();

    await client.post("/api/v1/auth/sign-up/email", { body: user });

    const response = await client.post("/api/v1/auth/passkey/verify-registration", {
      body: {
        response: {},
        name: "내 패스키",
      },
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  test("challenge 없이 verify-authentication 을 호출하면 실패한다", async () => {
    const client = environment.createClient();

    const response = await client.post("/api/v1/auth/passkey/verify-authentication", {
      body: {
        response: {
          id: "missing-passkey",
        },
      },
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  test("인증된 사용자는 자신의 패스키 목록을 조회할 수 있다", async () => {
    const client = environment.createClient();
    const user = createEmailPasswordUser();

    await client.post("/api/v1/auth/sign-up/email", { body: user });
    const response = await client.getJson<unknown[]>("/api/v1/auth/passkey/list-user-passkeys");

    expect(response.response.status).toBe(200);
    expect(response.json).toEqual([]);
  });

  test("비인증 사용자는 패스키 목록 수정 및 삭제 엔드포인트를 사용할 수 없다", async () => {
    const client = environment.createClient();

    const listResponse = await client.get("/api/v1/auth/passkey/list-user-passkeys");

    const updateResponse = await client.post("/api/v1/auth/passkey/update-passkey", {
      body: {
        id: "passkey-id",
        name: "새 이름",
      },
    });

    const deleteResponse = await client.post("/api/v1/auth/passkey/delete-passkey", {
      body: {
        id: "passkey-id",
      },
    });

    expect(listResponse.ok).toBe(false);
    expect(listResponse.status).toBeGreaterThanOrEqual(400);
    expect(updateResponse.ok).toBe(false);
    expect(updateResponse.status).toBeGreaterThanOrEqual(400);
    expect(deleteResponse.ok).toBe(false);
    expect(deleteResponse.status).toBeGreaterThanOrEqual(400);
  });
});
