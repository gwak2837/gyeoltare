import { z } from "zod";

const schema = z.object({
  API_PORT: z.coerce.number().int().positive().default(3001),
  BETTER_AUTH_SECRET: z.string().min(32).default("123456789012345678901234567890ab"),
  BETTER_AUTH_URL: z.url().default("http://localhost:3001"),
  DATABASE_URL: z.url().default("postgresql://postgres:postgres@localhost:5432/gyeoltare"),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.url().optional(),
  OTEL_LOGS_EXPORTER: z.string().default("none"),
  OTEL_METRICS_EXPORTER: z.string().default("none"),
  OTEL_TRACES_EXPORTER: z.string().default("otlp"),
  WEB_ORIGIN: z.url().default("http://localhost:3000"),
});

export const env = schema.parse({
  API_PORT: process.env.API_PORT,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  OTEL_LOGS_EXPORTER: process.env.OTEL_LOGS_EXPORTER,
  OTEL_METRICS_EXPORTER: process.env.OTEL_METRICS_EXPORTER,
  OTEL_TRACES_EXPORTER: process.env.OTEL_TRACES_EXPORTER,
  WEB_ORIGIN: process.env.WEB_ORIGIN,
});
