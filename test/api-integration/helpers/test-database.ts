import { execFile } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { GenericContainer, type StartedTestContainer, Wait } from "testcontainers";

import { resetDb } from "../../../packages/db/src/client";

const execFileAsync = promisify(execFile);
const currentDirectory = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDirectory, "../../..");

export type PostgresTestDatabase = {
  container: StartedTestContainer;
  databaseUrl: string;
};

export async function startPostgresTestDatabase(): Promise<PostgresTestDatabase> {
  const container = await new GenericContainer("postgres:17-alpine")
    .withEnvironment({
      POSTGRES_DB: "gyeoltare_test",
      POSTGRES_PASSWORD: "postgres",
      POSTGRES_USER: "postgres",
    })
    .withExposedPorts(5432)
    .withWaitStrategy(Wait.forLogMessage("database system is ready to accept connections"))
    .start();

  const databaseUrl = `postgres://postgres:postgres@${container.getHost()}:${container.getMappedPort(
    5432,
  )}/gyeoltare_test`;

  process.env.DATABASE_URL = databaseUrl;
  resetDb();

  await execFileAsync(
    "pnpm",
    ["exec", "drizzle-kit", "push", "--config", "packages/db/drizzle.dev.config.ts", "--force"],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
    },
  );

  return {
    container,
    databaseUrl,
  };
}

export async function stopPostgresTestDatabase(database?: PostgresTestDatabase) {
  resetDb();
  if (database) {
    await database.container.stop();
  }
}
