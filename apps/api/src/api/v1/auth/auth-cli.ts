import type { AuthOptions } from "./shared";
import { createAuthOptions } from "./shared";

export const auth: { options: AuthOptions } = { options: createAuthOptions(process.env as never) };
