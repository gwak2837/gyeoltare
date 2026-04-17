import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_DIRECT_URL ?? "postgres://postgres:postgres@localhost:5432/gyeoltare",
  },
  dialect: "postgresql",
  out: "./drizzle/dev",
  schema: "./src/schema/**/*.ts",
  strict: true,
});
