import "server-only";

import { createAuth } from "@gyeoltare/auth/server";

import { env } from "@/env";

export const auth = createAuth(env);
