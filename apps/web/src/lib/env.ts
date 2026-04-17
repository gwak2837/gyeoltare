import { z } from "zod";

const envSchema = z.object({
  API_INTERNAL_ORIGIN: z.string().url().default("http://localhost:3001"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

export const env = envSchema.parse({
  API_INTERNAL_ORIGIN: process.env.API_INTERNAL_ORIGIN,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
