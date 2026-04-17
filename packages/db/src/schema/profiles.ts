import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  bio: text("bio"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  displayName: varchar("display_name", { length: 120 }).notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  isPublic: boolean("is_public").default(true).notNull(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
});
