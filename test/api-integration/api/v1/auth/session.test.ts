import { afterAll, beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { createEmailPasswordUser } from "../../../_support/auth-fixtures";
import { createApiIntegrationTestEnvironment } from "../../../_support/test-environment";

const environment = createApiIntegrationTestEnvironment(new URL(import.meta.url).pathname);

type SessionResponse = {
  session: { userId: string };
  user: { email: string; name: string };
} | null;

describe("인증 세션 통합 테스트", () => {
  beforeAll(async () => {
    await environment.setup();
  });

  beforeEach(async () => {
    await environment.reset();
  });

  afterAll(async () => {
    await environment.teardown();
  });

  test("새 클라이언트는 기본적으로 비인증 상태다", async () => {
    const client = environment.createClient();
    const sessionResponse = await client.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json).toBeNull();
  });

  test("회원가입 후 발급된 세션 쿠키를 /get-session 에서 읽을 수 있다", async () => {
    const client = environment.createClient();
    const user = createEmailPasswordUser();

    type SignUpResponse = {
      token: string | null;
      user: { email: string; name: string };
    };

    const signUpResponse = await client.postJson<SignUpResponse>("/api/v1/auth/sign-up/email", { body: user });

    expect(signUpResponse.response.status).toBe(200);
    expect(signUpResponse.response.headers.getSetCookie().length).toBeGreaterThan(0);
    expect(signUpResponse.json.user.email).toBe(user.email);

    const sessionResponse = await client.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json?.user.email).toBe(user.email);
    expect(sessionResponse.json?.user.name).toBe(user.name);
    expect(sessionResponse.json?.session.userId).toBeTruthy();
  });

  test("로그아웃하면 현재 세션이 제거된다", async () => {
    const client = environment.createClient();
    const user = createEmailPasswordUser();

    await client.postJson("/api/v1/auth/sign-up/email", { body: user });
    const signOut = await client.postJson<{ success: boolean }>("/api/v1/auth/sign-out");

    expect(signOut.response.status).toBe(200);
    expect(signOut.json).toEqual({ success: true });

    const sessionResponse = await client.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json).toBeNull();
  });
});
