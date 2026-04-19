import { afterAll, beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { createEmailPasswordUser } from "../../../_support/auth-fixtures";
import { createApiIntegrationTestEnvironment } from "../../../_support/test-environment";
import { enableTwoFactor, generateTotpCode } from "../../../_support/two-factor";

const environment = createApiIntegrationTestEnvironment(new URL(import.meta.url).pathname);

type SessionResponse = {
  session: { userId: string };
  user: { email: string; name: string; twoFactorEnabled?: boolean | null };
} | null;

type TwoFactorRedirectResponse = {
  twoFactorMethods: string[];
  twoFactorRedirect: boolean;
};

describe("2FA 로그인 상태 전이 통합 테스트", () => {
  beforeAll(async () => {
    await environment.setup();
  });

  beforeEach(async () => {
    await environment.reset();
  });

  afterAll(async () => {
    await environment.teardown();
  });

  test("2FA 비활성 사용자는 로그인 즉시 세션이 확정된다", async () => {
    const signUpClient = environment.createClient();
    const signInClient = environment.createClient();
    const user = createEmailPasswordUser();

    await signUpClient.post("/api/v1/auth/sign-up/email", { body: user });

    const signIn = await signInClient.post("/api/v1/auth/sign-in/email", {
      body: {
        email: user.email,
        password: user.password,
      },
    });

    expect(signIn.status).toBe(200);

    const sessionResponse = await signInClient.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json?.user.email).toBe(user.email);
    expect(sessionResponse.json?.session.userId).toBeTruthy();
  });

  test("2FA 활성 사용자는 sign-in 후 twoFactorRedirect 응답을 받고 세션이 즉시 확정되지 않는다", async () => {
    const enrollmentClient = environment.createClient();
    const signInClient = environment.createClient();
    const user = createEmailPasswordUser();

    await enrollmentClient.post("/api/v1/auth/sign-up/email", { body: user });

    const enableResponse = await enableTwoFactor(enrollmentClient, user.password);
    const code = generateTotpCode(enableResponse.secret);

    await enrollmentClient.post("/api/v1/auth/two-factor/verify-totp", {
      body: { code },
    });

    await enrollmentClient.post("/api/v1/auth/sign-out");

    const signIn = await signInClient.postJson<TwoFactorRedirectResponse>("/api/v1/auth/sign-in/email", {
      body: {
        email: user.email,
        password: user.password,
      },
    });

    expect(signIn.response.status).toBe(200);
    expect(signIn.json.twoFactorRedirect).toBe(true);
    expect(signIn.json.twoFactorMethods).toContain("totp");

    const sessionResponse = await signInClient.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json).toBeNull();
  });

  test("twoFactorRedirect 상태에서 verify-totp 성공 시 세션이 확정된다", async () => {
    const enrollmentClient = environment.createClient();
    const signInClient = environment.createClient();
    const user = createEmailPasswordUser();

    await enrollmentClient.post("/api/v1/auth/sign-up/email", { body: user });

    const enableResponse = await enableTwoFactor(enrollmentClient, user.password);
    const enrollmentCode = generateTotpCode(enableResponse.secret);

    await enrollmentClient.post("/api/v1/auth/two-factor/verify-totp", {
      body: { code: enrollmentCode },
    });

    await enrollmentClient.post("/api/v1/auth/sign-out");

    await signInClient.post("/api/v1/auth/sign-in/email", {
      body: {
        email: user.email,
        password: user.password,
      },
    });

    const signInCode = generateTotpCode(enableResponse.secret);

    const verify = await signInClient.post("/api/v1/auth/two-factor/verify-totp", {
      body: { code: signInCode },
    });

    expect(verify.status).toBe(200);

    const sessionResponse = await signInClient.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json?.user.email).toBe(user.email);
    expect(sessionResponse.json?.user.twoFactorEnabled).toBe(true);
    expect(sessionResponse.json?.session.userId).toBeTruthy();
  });

  test("twoFactorRedirect 상태에서 verify-backup-code 성공 시 세션이 확정된다", async () => {
    const enrollmentClient = environment.createClient();
    const signInClient = environment.createClient();
    const user = createEmailPasswordUser();

    await enrollmentClient.post("/api/v1/auth/sign-up/email", { body: user });

    const enableResponse = await enableTwoFactor(enrollmentClient, user.password);
    const code = generateTotpCode(enableResponse.secret);

    await enrollmentClient.post("/api/v1/auth/two-factor/verify-totp", {
      body: { code },
    });

    await enrollmentClient.post("/api/v1/auth/sign-out");

    await signInClient.post("/api/v1/auth/sign-in/email", {
      body: {
        email: user.email,
        password: user.password,
      },
    });

    const verify = await signInClient.post("/api/v1/auth/two-factor/verify-backup-code", {
      body: { code: enableResponse.json.backupCodes[0] },
    });

    expect(verify.status).toBe(200);

    const sessionResponse = await signInClient.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json?.user.email).toBe(user.email);
    expect(sessionResponse.json?.session.userId).toBeTruthy();
  });

  test("잘못된 TOTP는 실패하고 세션이 확정되지 않는다", async () => {
    const enrollmentClient = environment.createClient();
    const signInClient = environment.createClient();
    const user = createEmailPasswordUser();

    await enrollmentClient.post("/api/v1/auth/sign-up/email", { body: user });

    const enableResponse = await enableTwoFactor(enrollmentClient, user.password);
    const code = generateTotpCode(enableResponse.secret);

    await enrollmentClient.post("/api/v1/auth/two-factor/verify-totp", {
      body: { code },
    });

    await enrollmentClient.post("/api/v1/auth/sign-out");

    await signInClient.post("/api/v1/auth/sign-in/email", {
      body: { email: user.email, password: user.password },
    });

    const verify = await signInClient.post("/api/v1/auth/two-factor/verify-totp", {
      body: { code: "000000" },
    });

    expect(verify.ok).toBe(false);
    expect(verify.status).toBeGreaterThanOrEqual(400);

    const sessionResponse = await signInClient.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json).toBeNull();
  });

  test("복구코드는 한 번 사용하면 재사용할 수 없다", async () => {
    const enrollmentClient = environment.createClient();
    const firstSignInClient = environment.createClient();
    const secondSignInClient = environment.createClient();
    const user = createEmailPasswordUser();

    await enrollmentClient.post("/api/v1/auth/sign-up/email", { body: user });

    const enableResponse = await enableTwoFactor(enrollmentClient, user.password);
    const code = generateTotpCode(enableResponse.secret);

    await enrollmentClient.post("/api/v1/auth/two-factor/verify-totp", {
      body: { code },
    });

    await enrollmentClient.post("/api/v1/auth/sign-out");

    await firstSignInClient.post("/api/v1/auth/sign-in/email", {
      body: {
        email: user.email,
        password: user.password,
      },
    });

    const firstVerify = await firstSignInClient.post("/api/v1/auth/two-factor/verify-backup-code", {
      body: { code: enableResponse.json.backupCodes[0] },
    });

    expect(firstVerify.status).toBe(200);

    await firstSignInClient.post("/api/v1/auth/sign-out");

    await secondSignInClient.post("/api/v1/auth/sign-in/email", {
      body: {
        email: user.email,
        password: user.password,
      },
    });

    const secondVerify = await secondSignInClient.post("/api/v1/auth/two-factor/verify-backup-code", {
      body: { code: enableResponse.json.backupCodes[0] },
    });

    expect(secondVerify.ok).toBe(false);
    expect(secondVerify.status).toBeGreaterThanOrEqual(400);

    const sessionResponse = await secondSignInClient.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json).toBeNull();
  });
});
