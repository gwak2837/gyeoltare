import type { AuthOptions } from "./server";
import { createAuthOptions } from "./server";

export const auth: { options: AuthOptions } = { options: createAuthOptions(process.env as never) };
