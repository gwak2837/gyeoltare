import type { AppType } from "@repo/api";
import { hc } from "hono/client";

type ServerApiClientOptions = {
  baseUrl: string;
  headers?: Record<string, string>;
};

export function createServerApiClient({ baseUrl, headers }: ServerApiClientOptions) {
  return hc<AppType>(baseUrl, {
    headers,
  });
}
