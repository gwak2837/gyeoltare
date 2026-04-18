import { z } from "zod";

const schema = z.object({
  API_PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.url(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.url().optional(),
  WEB_ORIGIN: z.url(),
});

export const env = schema.parse({
  API_PORT: process.env.API_PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  WEB_ORIGIN: process.env.WEB_ORIGIN,
});
