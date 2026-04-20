import type { AuthEnv, AuthOptions } from "./server";
import { createAuthOptions } from "./server";

type AuthCLI = {
  options: AuthOptions;
};

export const auth: AuthCLI = {
  options: createAuthOptions(process.env as AuthEnv),
};
