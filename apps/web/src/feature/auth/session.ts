import "server-only";

import type { AuthSessionData } from "@gyeoltare/auth/server";
import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "./server-auth";

export const getCurrentSession = cache(async function getCurrentSession(): Promise<AuthSessionData | null> {
  return await auth.api.getSession({ headers: await headers() });
});
