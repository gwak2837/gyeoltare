import { afterAll, beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { createEmailPasswordUser } from "./_support/auth-fixtures";
import { createApiIntegrationTestEnvironment } from "./_support/test-environment";

const environment = createApiIntegrationTestEnvironment(new URL(import.meta.url).pathname);
const reusableUser = createEmailPasswordUser({ email: "repeatable-user@example.com" });

describe("API 통합 테스트 격리", () => {
  beforeAll(async () => {
    await environment.setup();
  });

  beforeEach(async () => {
    await environment.reset();
  });

  afterAll(async () => {
    await environment.teardown();
  });

  test("각 테스트는 자신의 격리된 데이터베이스에 상태를 만들 수 있다", async () => {
    const client = environment.createClient();
    const signUp = await client.post("/api/v1/auth/sign-up/email", { body: reusableUser });

    expect(signUp.status).toBe(200);
  });

  test("다음 테스트는 깨끗한 데이터베이스 스냅샷에서 시작한다", async () => {
    const client = environment.createClient();
    const sessionResponse = await client.getJson<null>("/api/v1/auth/get-session");

    expect(sessionResponse.json).toBeNull();

    const signUp = await client.post("/api/v1/auth/sign-up/email", { body: reusableUser });

    expect(signUp.status).toBe(200);
  });
});
