import { getPostgresContainer } from "./container";
import { createSqlConnection, disconnectSql, dropDatabaseIfExists, truncatePublicSchemaTables } from "./postgres";
import { buildDatabaseUrl, createPerFileDatabaseName } from "./shared";
import { ensureTemplateDatabase } from "./template-db";

export type IsolatedTestDatabase = {
  databaseName: string;
  databaseUrl: string;
  drop: () => Promise<void>;
  reset: () => Promise<void>;
};

export async function createIsolatedTestDatabase(testFilePath: string): Promise<IsolatedTestDatabase> {
  const templateDatabase = await ensureTemplateDatabase();
  const container = await getPostgresContainer();
  const adminSql = createSqlConnection(templateDatabase.adminDatabaseUrl);
  const databaseName = createPerFileDatabaseName(testFilePath);

  const databaseUrl = buildDatabaseUrl({
    databaseName,
    host: container.host,
    password: container.password,
    port: container.port,
    username: container.username,
  });

  try {
    await adminSql.unsafe(`CREATE DATABASE "${databaseName}" TEMPLATE "${templateDatabase.databaseName}"`);
  } finally {
    await disconnectSql(adminSql);
  }

  async function drop() {
    const sql = createSqlConnection(templateDatabase.adminDatabaseUrl);

    try {
      await dropDatabaseIfExists(sql, databaseName);
    } finally {
      await disconnectSql(sql);
    }
  }

  async function reset() {
    await truncatePublicSchemaTables(databaseUrl);
  }

  return {
    databaseName,
    databaseUrl,
    drop,
    reset,
  };
}
