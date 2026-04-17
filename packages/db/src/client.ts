import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const globalForDb = globalThis as {
  __gyeoltareDb?: ReturnType<typeof createDatabase>;
};

function createDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set before the database client is used.");
  }

  const client = postgres(process.env.DATABASE_URL, {
    max: 10,
    prepare: false,
  });

  return drizzle(client, {
    schema,
  });
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (!globalForDb.__gyeoltareDb) {
    globalForDb.__gyeoltareDb = createDatabase();
  }

  return globalForDb.__gyeoltareDb;
}

export function resetDb() {
  delete globalForDb.__gyeoltareDb;
}
