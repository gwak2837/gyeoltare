import { db, schema } from "@gyeoltare/db/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { env } from "@/env";

export const auth = betterAuth({
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
  plugins: [openAPI()],
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.WEB_ORIGIN],
});

export type AuthSession = typeof auth.$Infer.Session;
export type AuthSessionData = AuthSession["session"];
export type AuthUser = AuthSession["user"];
