import type { Session, User } from "better-auth";
import { betterAuth } from "better-auth";
import { env } from "@/env";
import type { AuthInstance } from "./shared";
import { createAuthOptions } from "./shared";

export type AuthSessionData = {
  session: Session<Record<string, never>, []>;
  user: User<Record<string, never>, []> & {
    displayUsername?: string | null;
    twoFactorEnabled?: boolean | null;
    username?: string | null;
  };
};

export const auth: AuthInstance = betterAuth(createAuthOptions(env));
