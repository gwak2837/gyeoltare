import { createHash, randomBytes } from "node:crypto";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
export const POSTGRES_IMAGE = "postgres:18";
export const POSTGRES_PORT = 5432;
export const ROOT_DATABASE_NAME = "postgres";
export const TEMPLATE_DATABASE_NAME = "template_api_integration";
export const TEMPLATE_DATABASE_LOCK_ID = 2026041901;

export function buildDatabaseUrl(input: {
  databaseName: string;
  host: string;
  password: string;
  port: number;
  username: string;
}) {
  const url = new URL("postgresql://localhost");

  url.hostname = input.host;
  url.password = input.password;
  url.pathname = `/${input.databaseName}`;
  url.port = String(input.port);
  url.username = input.username;

  return url.toString();
}

export function createHighEntropySecret() {
  return `1:${randomBytes(32).toString("hex")}`;
}

export function createPerFileDatabaseName(testFilePath: string) {
  const fileName = basename(testFilePath, ".test.ts");
  const hash = createHash("sha256").update(testFilePath).digest("hex").slice(0, 10);
  const randomSuffix = randomBytes(4).toString("hex");
  const sanitizedFileName = fileName.replaceAll(/[^a-zA-Z0-9_]/g, "_").slice(0, 24);
  const databaseName = `test_${sanitizedFileName}_${hash}_${randomSuffix}`;

  return databaseName.slice(0, 63);
}

export async function sleep(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}
