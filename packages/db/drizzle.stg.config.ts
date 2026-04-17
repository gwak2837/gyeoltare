import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://postgres:postgres@staging-postgres:5432/gyeoltare",
  },
  dialect: "postgresql",
  out: "./drizzle/staging",
  schema: "./src/schema/**/*.ts",
  strict: true,
});
