import { passkey } from "@better-auth/passkey";
import { db, schema } from "@gyeoltare/db/client";
import type { Auth, BetterAuthOptions, Session, User } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, twoFactor, username } from "better-auth/plugins";

import { AUTH_BASE_PATH } from "./constants";

export type AuthEnv = {
  DATABASE_URL: string;
  BETTER_AUTH_PASSKEY_RP_ID: string;
  BETTER_AUTH_PASSKEY_RP_NAME: string;
  BETTER_AUTH_SECRETS: string;
  WEB_ORIGIN: string;
} & Record<string, unknown>;

export type AuthOptions = Omit<BetterAuthOptions, "plugins"> & {
  plugins: [
    ReturnType<typeof openAPI>,
    ReturnType<typeof twoFactor>,
    ReturnType<typeof username>,
    ReturnType<typeof passkey>,
  ];
};

export type AuthInstance = Auth<AuthOptions>;

export type AuthSessionData = {
  session: Session<Record<string, never>, []>;
  user: User<Record<string, never>, []> & {
    displayUsername?: string | null;
    twoFactorEnabled?: boolean | null;
    username?: string | null;
  };
};

export function createAuthOptions(env: AuthEnv): AuthOptions {
  return {
    appName: "gyeoltare",
    basePath: AUTH_BASE_PATH,
    baseURL: env.WEB_ORIGIN,
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
      username(),
      passkey({
        origin: env.WEB_ORIGIN,
        rpID: env.BETTER_AUTH_PASSKEY_RP_ID,
        rpName: env.BETTER_AUTH_PASSKEY_RP_NAME,
      }),
    ],
    secrets: parseBetterAuthSecrets(env.BETTER_AUTH_SECRETS),
    trustedOrigins: [env.WEB_ORIGIN],
  };
}

export function createAuth(env: AuthEnv): AuthInstance {
  return betterAuth(createAuthOptions(env));
}

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
