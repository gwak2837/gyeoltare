import { passkey } from "@better-auth/passkey";
import { db, schema } from "@gyeoltare/db/client";
import {
  type BetterAuthOptions,
  type Session as BetterAuthSessionDataModel,
  type User as BetterAuthUserModel,
  betterAuth,
} from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, twoFactor } from "better-auth/plugins";
import { env } from "@/env";

export type AuthUser = RawAuthSession["user"] & { twoFactorEnabled: boolean };

export type AuthSessionData = RawAuthSession["session"];

type RawAuthSession = {
  session: BetterAuthSessionDataModel<Record<string, never>, []>;
  user: BetterAuthUserModel<Record<string, never>, []>;
};

type AuthRuntime = {
  api: {
    getSession(input: { headers: Headers }): Promise<RawAuthSession | null>;
  };
  handler(request: Request): Promise<Response>;
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

const authInstance: AuthRuntime = betterAuth(authOptions);

export const auth: { options: BetterAuthOptions } = {
  options: authOptions,
};

export function handleAuthRequest(request: Request) {
  return authInstance.handler(request);
}

export async function getAuthSession(headers: Headers): Promise<{
  session: AuthSessionData;
  user: AuthUser;
} | null> {
  const session = await authInstance.api.getSession({ headers });

  if (!session) {
    return null;
  }

  const twoFactorEnabled = "twoFactorEnabled" in session.user ? Boolean(session.user.twoFactorEnabled) : false;

  return {
    session: session.session,
    user: {
      ...session.user,
      twoFactorEnabled,
    },
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
