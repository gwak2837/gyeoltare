"use client";

import { passkeyClient } from "@better-auth/passkey/client";
import { twoFactorClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { env } from "@/env";

export const authClient = createAuthClient({
  baseURL: env.API_ORIGIN,
  basePath: "/api/v1/auth",
  plugins: [twoFactorClient(), passkeyClient(), usernameClient()],
});
