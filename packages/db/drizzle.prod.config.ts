import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_DIRECT_URL ?? "postgres://postgres:postgres@localhost:55432/gyeoltare",
  },
  dialect: "postgresql",
  out: "./drizzle/production",
  schema: "./src/schema/**/*.ts",
  strict: true,
});
