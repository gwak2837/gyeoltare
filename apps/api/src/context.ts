import type { AuthSessionData } from "./api/v1/auth/auth";

export type AppEnv = {
  Variables: {
    requestId: string;
    session: AuthSessionData["session"] | null;
    user: AuthSessionData["user"] | null;
  };
};
