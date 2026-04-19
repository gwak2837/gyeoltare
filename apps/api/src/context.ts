import type { AuthData } from "./api/v1/auth/auth";

export type AppBindings = {
  Variables: {
    requestId: string;
    session: AuthData["session"] | null;
    user: AuthData["user"] | null;
  };
};
