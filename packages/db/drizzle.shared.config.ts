import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { DEFAULT_DATABASE_URL, withDatabaseSSLRootCert } from "./src/ssl";

const PACKAGE_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(PACKAGE_DIR, "../..");
const ENV_FILE_NAMES = [".env.local", ".env"];

loadWorkspaceEnv();

export function createDrizzleConfig(out: string) {
  const databaseUrl = withDatabaseSSLRootCert(process.env.DATABASE_DIRECT_URL ?? DEFAULT_DATABASE_URL);

  return defineConfig({
    dbCredentials: { url: databaseUrl },
    dialect: "postgresql",
    out,
    schema: "./src/schema/**/*.ts",
    strict: true,
  });
}

function loadWorkspaceEnv() {
  for (const envFileName of ENV_FILE_NAMES) {
    const envFilePath = path.join(WORKSPACE_ROOT, envFileName);

    if (!existsSync(envFilePath)) {
      continue;
    }

    loadEnv({ path: envFilePath, override: false, quiet: true });
  }
}
