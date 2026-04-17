import type { AppType } from "@repo/api";
import { hc } from "hono/client";

export function createBrowserApiClient(baseUrl = "") {
  return hc<AppType>(baseUrl);
}
