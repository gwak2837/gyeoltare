import "server-only";

import { z } from "zod";

const envSchema = z.object({
  API_ORIGIN: z.url().default("http://localhost:3001"),
  BETTER_AUTH_PASSKEY_RP_ID: z.string().min(1).default("localhost"),
  BETTER_AUTH_PASSKEY_RP_NAME: z.string().min(1).default("gyeoltare"),
  BETTER_AUTH_SECRETS: z.string().min(1).default("1:123456789012345678901234567890ab"),
  DATABASE_URL: z.url().default("postgresql://postgres:postgres@localhost:55432/gyeoltare"),
  WEB_ORIGIN: z.url().default("http://localhost:3000"),
});

export const env = envSchema.parse({
  API_ORIGIN: process.env.API_ORIGIN,
  BETTER_AUTH_PASSKEY_RP_ID: process.env.BETTER_AUTH_PASSKEY_RP_ID,
  BETTER_AUTH_PASSKEY_RP_NAME: process.env.BETTER_AUTH_PASSKEY_RP_NAME,
  BETTER_AUTH_SECRETS: process.env.BETTER_AUTH_SECRETS,
  DATABASE_URL: process.env.DATABASE_URL,
  WEB_ORIGIN: process.env.WEB_ORIGIN,
});
