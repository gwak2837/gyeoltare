import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as contactMessagesSchema from "./schema/contact-messages";
import * as profilesSchema from "./schema/profiles";

const schema = {
  ...contactMessagesSchema,
  ...profilesSchema,
};

const client = postgres(process.env.DATABASE_URL!, {
  max: 10,
  prepare: false,
});

export const db = drizzle(client, {
  schema,
});
