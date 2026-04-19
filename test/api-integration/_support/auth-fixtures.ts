import { randomBytes } from "node:crypto";

export function createEmailPasswordUser(
  overrides: Partial<{
    email: string;
    name: string;
    password: string;
  }> = {},
) {
  const suffix = randomBytes(6).toString("hex");

  return {
    email: `user-${suffix}@example.com`,
    name: `테스트 사용자 ${suffix}`,
    password: "StrongPassword!1234",
    ...overrides,
  };
}
