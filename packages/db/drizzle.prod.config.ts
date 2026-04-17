import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url:
      process.env.DATABASE_URL ?? "postgres://postgres:postgres@production-postgres:5432/gyeoltare",
  },
  dialect: "postgresql",
  out: "./drizzle/production",
  schema: "./src/schema/**/*.ts",
  strict: true,
});
