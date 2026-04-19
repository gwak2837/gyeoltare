import "server-only";

import type { AuthSessionData } from "@gyeoltare/auth/server";
import { headers } from "next/headers";

import { auth } from "./server-auth";

export async function getCurrentSession(): Promise<AuthSessionData | null> {
  return await auth.api.getSession({ headers: await headers() });
}
