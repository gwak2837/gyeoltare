import { z } from "zod";

const envSchema = z.object({
  API_ORIGIN: z.url().default("http://localhost:3001"),
  WEB_ORIGIN: z.url().default("http://localhost:3000"),
});

export const env = envSchema.parse({
  API_ORIGIN: process.env.API_ORIGIN,
  WEB_ORIGIN: process.env.WEB_ORIGIN,
});
