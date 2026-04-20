"use client";

import { passkeyClient } from "@better-auth/passkey/client";
import { twoFactorClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { AUTH_BASE_PATH } from "./constants";

type GyeoltareAuthClientOptions = {
  basePath: typeof AUTH_BASE_PATH;
  plugins: [ReturnType<typeof twoFactorClient>, ReturnType<typeof passkeyClient>, ReturnType<typeof usernameClient>];
};

export const authClient = createAuthClient<GyeoltareAuthClientOptions>({
  basePath: AUTH_BASE_PATH,
  plugins: [twoFactorClient(), passkeyClient(), usernameClient()],
});
