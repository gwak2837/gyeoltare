import postgres, { type Sql } from "postgres";

export function createSqlConnection(databaseUrl: string) {
  return postgres(databaseUrl, {
    max: 1,
    prepare: false,
  });
}

export async function disconnectSql(sql: Sql) {
  await sql.end({ timeout: 0 });
}

export async function dropDatabaseIfExists(sql: Sql, databaseName: string) {
  await sql`
    select pg_terminate_backend(pid)
    from pg_stat_activity
    where datname = ${databaseName}
      and pid <> pg_backend_pid()
  `;

  await sql.unsafe(`DROP DATABASE IF EXISTS "${databaseName.replaceAll('"', '""')}"`);
}

export async function truncatePublicSchemaTables(databaseUrl: string) {
  const sql = createSqlConnection(databaseUrl);

  try {
    const tables = await sql<{ qualified_name: string }[]>`
      select quote_ident(schemaname) || '.' || quote_ident(tablename) as qualified_name
      from pg_tables
      where schemaname = 'public'
      order by tablename
    `;

    if (tables.length === 0) {
      return;
    }

    await sql.unsafe(
      `TRUNCATE TABLE ${tables.map((table) => table.qualified_name).join(", ")} RESTART IDENTITY CASCADE`,
    );
  } finally {
    await disconnectSql(sql);
  }
}
