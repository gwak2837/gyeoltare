import type { AuthSessionData, AuthUser } from "./api/v1/auth/auth";

export type AppBindings = {
  Variables: {
    requestId: string;
    session: AuthSessionData | null;
    user: AuthUser | null;
  };
};
