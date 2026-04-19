import { afterAll, beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { createEmailPasswordUser } from "../../../_support/auth-fixtures";
import { createApiIntegrationTestEnvironment } from "../../../_support/test-environment";
import { enableTwoFactor, generateTotpCode } from "../../../_support/two-factor";

const environment = createApiIntegrationTestEnvironment(new URL(import.meta.url).pathname);

type SessionResponse = {
  session: { userId: string };
  user: { email: string; name: string; twoFactorEnabled?: boolean | null };
} | null;

describe("TOTP 2FA 설정 통합 테스트", () => {
  beforeAll(async () => {
    await environment.setup();
  });

  beforeEach(async () => {
    await environment.reset();
  });

  afterAll(async () => {
    await environment.teardown();
  });

  test("로그인된 사용자만 2FA를 활성화할 수 있다", async () => {
    const client = environment.createClient();

    const response = await client.post("/api/v1/auth/two-factor/enable", {
      body: { password: "StrongPassword!1234" },
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  test("enable 응답은 totpURI와 초기 복구코드를 반환하고 verify 전에는 완전 활성화되지 않는다", async () => {
    const client = environment.createClient();
    const user = createEmailPasswordUser();

    await client.post("/api/v1/auth/sign-up/email", { body: user });

    const enableResponse = await enableTwoFactor(client, user.password);

    expect(enableResponse.response.status).toBe(200);
    expect(enableResponse.json.totpURI.startsWith("otpauth://")).toBe(true);
    expect(enableResponse.json.backupCodes.length).toBeGreaterThan(0);

    const sessionResponse = await client.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json?.user.twoFactorEnabled).not.toBe(true);

    const generateBackupCodes = await client.post("/api/v1/auth/two-factor/generate-backup-codes", {
      body: { password: user.password },
    });

    expect(generateBackupCodes.ok).toBe(false);
    expect(generateBackupCodes.status).toBeGreaterThanOrEqual(400);
  });

  test("올바른 TOTP 검증 후 현재 세션의 사용자 상태가 2FA 활성화로 갱신된다", async () => {
    const client = environment.createClient();
    const user = createEmailPasswordUser();

    await client.post("/api/v1/auth/sign-up/email", { body: user });

    const enableResponse = await enableTwoFactor(client, user.password);
    const code = generateTotpCode(enableResponse.secret);
    const verifyResponse = await client.post("/api/v1/auth/two-factor/verify-totp", {
      body: { code },
    });

    expect(verifyResponse.status).toBe(200);

    const sessionResponse = await client.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json?.user.twoFactorEnabled).toBe(true);
  });

  test("잘못된 TOTP는 실패한다", async () => {
    const client = environment.createClient();
    const user = createEmailPasswordUser();

    await client.post("/api/v1/auth/sign-up/email", { body: user });
    await enableTwoFactor(client, user.password);

    const verifyResponse = await client.post("/api/v1/auth/two-factor/verify-totp", {
      body: { code: "000000" },
    });

    expect(verifyResponse.ok).toBe(false);
    expect(verifyResponse.status).toBeGreaterThanOrEqual(400);

    const sessionResponse = await client.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json?.user.twoFactorEnabled).not.toBe(true);
  });

  test("2FA 활성화 후 복구코드를 재발급할 수 있다", async () => {
    const client = environment.createClient();
    const user = createEmailPasswordUser();

    await client.post("/api/v1/auth/sign-up/email", { body: user });

    const enableResponse = await enableTwoFactor(client, user.password);
    const code = generateTotpCode(enableResponse.secret);

    await client.post("/api/v1/auth/two-factor/verify-totp", {
      body: { code },
    });

    const regenerateResponse = await client.postJson<{ backupCodes: string[]; status: boolean }>(
      "/api/v1/auth/two-factor/generate-backup-codes",
      {
        body: { password: user.password },
      },
    );

    expect(regenerateResponse.response.status).toBe(200);
    expect(regenerateResponse.json.status).toBe(true);
    expect(regenerateResponse.json.backupCodes.length).toBeGreaterThan(0);
    expect(JSON.stringify(regenerateResponse.json.backupCodes)).not.toBe(
      JSON.stringify(enableResponse.json.backupCodes),
    );
  });

  test("disable 후에는 더 이상 2FA 활성 사용자로 보이지 않는다", async () => {
    const client = environment.createClient();
    const user = createEmailPasswordUser();

    await client.post("/api/v1/auth/sign-up/email", { body: user });

    const enableResponse = await enableTwoFactor(client, user.password);
    const code = generateTotpCode(enableResponse.secret);

    await client.post("/api/v1/auth/two-factor/verify-totp", {
      body: { code },
    });

    const disableResponse = await client.postJson<{ status: boolean }>("/api/v1/auth/two-factor/disable", {
      body: { password: user.password },
    });

    expect(disableResponse.response.status).toBe(200);
    expect(disableResponse.json.status).toBe(true);

    const sessionResponse = await client.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json?.user.twoFactorEnabled).not.toBe(true);
  });
});
