import { passkey } from "@better-auth/passkey";
import { db, schema } from "@gyeoltare/db/client";
import { type BetterAuthOptions, betterAuth, type Session, type User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, twoFactor } from "better-auth/plugins";
import { env } from "@/env";

export type AuthData = {
  session: Session<Record<string, never>, []>;
  user: User<Record<string, never>, []> & { twoFactorEnabled?: boolean | null };
};

const authOptions: BetterAuthOptions = {
  appName: "gyeoltare",
  basePath: "/api/v1/auth",
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    openAPI(),
    twoFactor(),
    passkey({
      origin: env.BETTER_AUTH_PASSKEY_ORIGIN,
      rpID: env.BETTER_AUTH_PASSKEY_RP_ID,
      rpName: env.BETTER_AUTH_PASSKEY_RP_NAME,
    }),
  ],
  secrets: parseBetterAuthSecrets(env.BETTER_AUTH_SECRETS),
  trustedOrigins: [env.WEB_ORIGIN],
};

export const authInstance = betterAuth(authOptions);

// NOTE: Better Auth CLI가 스키마를 생성할 때 `auth.options` 를 읽어요
export const auth = { options: authOptions };

function parseBetterAuthSecrets(secretList: string) {
  return secretList.split(",").map((entry) => {
    const [versionPart, ...valueParts] = entry.split(":");
    const version = Number(versionPart?.trim());
    const value = valueParts.join(":").trim();

    if (!Number.isInteger(version) || version < 1) {
      throw new Error(`Invalid BETTER_AUTH_SECRETS version: "${entry}"`);
    }

    if (value.length < 32) {
      throw new Error(`BETTER_AUTH_SECRETS values must be at least 32 characters: "${entry}"`);
    }

    return { version, value };
  });
}
