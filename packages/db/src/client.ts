import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as betterAuthSchema from "./schema/better-auth.generated";

const databaseUrl = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:55432/gyeoltare";

const client = postgres(databaseUrl, { prepare: false });

export const schema = {
  ...betterAuthSchema,
};

export const db = drizzle(client, { schema });
