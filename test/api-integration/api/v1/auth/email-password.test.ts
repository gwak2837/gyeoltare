import { afterAll, beforeAll, beforeEach, describe, expect, test } from "bun:test";
import { createEmailPasswordUser } from "../../../_support/auth-fixtures";
import { createApiIntegrationTestEnvironment } from "../../../_support/test-environment";

const environment = createApiIntegrationTestEnvironment(new URL(import.meta.url).pathname);

type SessionResponse = {
  session: { userId: string };
  user: { email: string; name: string };
} | null;

describe("이메일/비밀번호 인증 통합 테스트", () => {
  beforeAll(async () => {
    await environment.setup();
  });

  beforeEach(async () => {
    await environment.reset();
  });

  afterAll(async () => {
    await environment.teardown();
  });

  test("기존 계정은 새 클라이언트에서 이메일/비밀번호로 로그인할 수 있다", async () => {
    const signUpClient = environment.createClient();
    const signInClient = environment.createClient();
    const user = createEmailPasswordUser();

    const signUp = await signUpClient.post("/api/v1/auth/sign-up/email", { body: user });

    const signIn = await signInClient.post("/api/v1/auth/sign-in/email", {
      body: {
        email: user.email,
        password: user.password,
      },
    });

    expect(signUp.status).toBe(200);
    expect(signIn.status).toBe(200);
    expect(signIn.headers.getSetCookie().length).toBeGreaterThan(0);

    const sessionResponse = await signInClient.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json?.user.email).toBe(user.email);
    expect(sessionResponse.json?.user.name).toBe(user.name);
    expect(sessionResponse.json?.session.userId).toBeTruthy();
  });

  test("브라우저의 Accept-Language 헤더가 있어도 세션 쿠키가 발급된다", async () => {
    const signUpClient = environment.createClient();
    const signInClient = environment.createClient();
    const user = createEmailPasswordUser();

    const signUp = await signUpClient.post("/api/v1/auth/sign-up/email", { body: user });

    const signIn = await signInClient.post("/api/v1/auth/sign-in/email", {
      body: {
        email: user.email,
        password: user.password,
      },
      headers: {
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    expect(signUp.status).toBe(200);
    expect(signIn.status).toBe(200);
    expect(signIn.headers.getSetCookie().some((cookie) => cookie.startsWith("better-auth.session_token="))).toBe(true);

    const sessionResponse = await signInClient.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json?.user.email).toBe(user.email);
    expect(sessionResponse.json?.session.userId).toBeTruthy();
  });

  test("잘못된 비밀번호로 로그인하면 실패하고 세션이 생성되지 않는다", async () => {
    const signUpClient = environment.createClient();
    const signInClient = environment.createClient();
    const user = createEmailPasswordUser();

    const signUp = await signUpClient.post("/api/v1/auth/sign-up/email", { body: user });

    const signIn = await signInClient.post("/api/v1/auth/sign-in/email", {
      body: {
        email: user.email,
        password: "WrongPassword!1234",
      },
    });

    expect(signUp.status).toBe(200);
    expect(signIn.ok).toBe(false);
    expect(signIn.status).toBeGreaterThanOrEqual(400);

    const sessionResponse = await signInClient.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json).toBeNull();
  });

  test("중복 회원가입은 실패하고 세션이 생성되지 않는다", async () => {
    const firstClient = environment.createClient();
    const duplicateClient = environment.createClient();
    const user = createEmailPasswordUser();

    const firstSignUp = await firstClient.post("/api/v1/auth/sign-up/email", { body: user });
    const duplicateSignUp = await duplicateClient.post("/api/v1/auth/sign-up/email", { body: user });

    expect(firstSignUp.status).toBe(200);
    expect(duplicateSignUp.ok).toBe(false);
    expect(duplicateSignUp.status).toBeGreaterThanOrEqual(400);

    const sessionResponse = await duplicateClient.getJson<SessionResponse>("/api/v1/auth/get-session");

    expect(sessionResponse.response.status).toBe(200);
    expect(sessionResponse.json).toBeNull();
  });
});
