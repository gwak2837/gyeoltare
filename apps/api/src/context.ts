import type { AuthSessionData } from "@gyeoltare/auth/server";

export type AppEnv = {
  Variables: {
    requestId: string;
    session: AuthSessionData["session"] | null;
    user: AuthSessionData["user"] | null;
  };
};
