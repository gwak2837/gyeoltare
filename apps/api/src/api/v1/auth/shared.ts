import { passkey } from "@better-auth/passkey";
import { db, schema } from "@gyeoltare/db/client";
import type { Auth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, twoFactor, username } from "better-auth/plugins";

type AuthEnv = {
  BETTER_AUTH_PASSKEY_ORIGIN: string;
  BETTER_AUTH_PASSKEY_RP_ID: string;
  BETTER_AUTH_PASSKEY_RP_NAME: string;
  BETTER_AUTH_SECRETS: string;
  BETTER_AUTH_URL: string;
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

export function createAuthOptions(env: AuthEnv): AuthOptions {
  return {
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
      username(),
      passkey({
        origin: env.BETTER_AUTH_PASSKEY_ORIGIN,
        rpID: env.BETTER_AUTH_PASSKEY_RP_ID,
        rpName: env.BETTER_AUTH_PASSKEY_RP_NAME,
      }),
    ],
    secrets: parseBetterAuthSecrets(env.BETTER_AUTH_SECRETS),
    trustedOrigins: [env.WEB_ORIGIN],
  };
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
