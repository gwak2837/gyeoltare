import "server-only";

import { createServerApiClient } from "@gyeoltare/api-client/server";
import { cookies, headers } from "next/headers";

import { env } from "@/lib/env";

export async function getServerApiClient() {
  const cookieStore = await cookies();
  const headerList = await headers();

  return createServerApiClient({
    baseUrl: env.API_INTERNAL_ORIGIN,
    headers: {
      cookie: cookieStore.toString(),
      "x-forwarded-host": headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "",
      "x-forwarded-proto": headerList.get("x-forwarded-proto") ?? "https",
    },
  });
}
