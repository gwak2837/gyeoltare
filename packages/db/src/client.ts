import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as betterAuthSchema from "./schema/better-auth.generated";
import { DEFAULT_DATABASE_URL, getDatabaseSSLOptions } from "./ssl";

const databaseURL = process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL;
const databaseSSL = getDatabaseSSLOptions(databaseURL);

const client = postgres(databaseURL, {
  prepare: false,
  ...(databaseSSL && { ssl: databaseSSL }),
});

export const schema = {
  ...betterAuthSchema,
};

export const db = drizzle(client, { schema });
