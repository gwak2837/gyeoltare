import "server-only";

import { cookies } from "next/headers";

export async function getCurrentSessionSnapshot() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  return {
    isAuthenticated: Boolean(sessionCookie?.value),
    sessionCookie: sessionCookie?.value ?? null,
  };
}
