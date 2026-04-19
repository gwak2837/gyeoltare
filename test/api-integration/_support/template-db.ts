import { getPostgresContainer } from "./container";
import { createSqlConnection, disconnectSql, dropDatabaseIfExists } from "./postgres";
import { runCommand } from "./process";
import { buildDatabaseUrl, REPO_ROOT, TEMPLATE_DATABASE_LOCK_ID, TEMPLATE_DATABASE_NAME } from "./shared";

export type TemplateDatabaseInfo = {
  adminDatabaseUrl: string;
  databaseName: string;
};

const globalTemplateState = globalThis as typeof globalThis & {
  __gyeoltareApiIntegrationTemplatePromise?: Promise<TemplateDatabaseInfo>;
};

export async function ensureTemplateDatabase() {
  if (!globalTemplateState.__gyeoltareApiIntegrationTemplatePromise) {
    globalTemplateState.__gyeoltareApiIntegrationTemplatePromise = setupTemplateDatabase();
  }

  return globalTemplateState.__gyeoltareApiIntegrationTemplatePromise;
}

async function setupTemplateDatabase(): Promise<TemplateDatabaseInfo> {
  const container = await getPostgresContainer();
  const adminSql = createSqlConnection(container.adminDatabaseUrl);
  let createdTemplateDatabase = false;

  try {
    await adminSql`select pg_advisory_lock(${TEMPLATE_DATABASE_LOCK_ID})`;

    const existingTemplate = await adminSql<{ exists: boolean }[]>`
      select exists(select 1 from pg_database where datname = ${TEMPLATE_DATABASE_NAME}) as exists
    `;

    if (!existingTemplate[0]?.exists) {
      createdTemplateDatabase = true;

      await adminSql.unsafe(`CREATE DATABASE "${TEMPLATE_DATABASE_NAME}"`);

      const templateDatabaseUrl = buildDatabaseUrl({
        databaseName: TEMPLATE_DATABASE_NAME,
        host: container.host,
        password: container.password,
        port: container.port,
        username: container.username,
      });

      await runCommand({
        command: [
          "pnpm",
          "--dir",
          "packages/db",
          "exec",
          "drizzle-kit",
          "push",
          "--config",
          "drizzle.dev.config.ts",
          "--force",
        ],
        cwd: REPO_ROOT,
        env: {
          ...process.env,
          DATABASE_DIRECT_URL: templateDatabaseUrl,
          DATABASE_URL: templateDatabaseUrl,
        },
        label: `drizzle-kit push (${TEMPLATE_DATABASE_NAME})`,
        timeoutMs: 120_000,
      });

      await adminSql.unsafe(`ALTER DATABASE "${TEMPLATE_DATABASE_NAME}" IS_TEMPLATE true`);
    }

    return {
      adminDatabaseUrl: container.adminDatabaseUrl,
      databaseName: TEMPLATE_DATABASE_NAME,
    };
  } catch (error) {
    if (createdTemplateDatabase) {
      await dropDatabaseIfExists(adminSql, TEMPLATE_DATABASE_NAME);
    }

    throw error;
  } finally {
    try {
      await adminSql`select pg_advisory_unlock(${TEMPLATE_DATABASE_LOCK_ID})`;
    } finally {
      await disconnectSql(adminSql);
    }
  }
}
