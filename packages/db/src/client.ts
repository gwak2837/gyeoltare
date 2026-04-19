import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as betterAuthSchema from "./schema/better-auth.generated";
import * as contactMessagesSchema from "./schema/contact-messages";
import * as profilesSchema from "./schema/profiles";

const databaseUrl = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:55432/gyeoltare";

const client = postgres(databaseUrl, {
  max: 10,
  prepare: false,
});

export const schema = {
  ...contactMessagesSchema,
  ...profilesSchema,
  ...betterAuthSchema,
};

export const db = drizzle(client, {
  schema,
});
