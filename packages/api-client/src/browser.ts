import type { AppType } from "@gyeoltare/api/types";
import { hc } from "hono/client";

export function createBrowserApiClient(baseUrl = "") {
  return hc<AppType>(baseUrl);
}
