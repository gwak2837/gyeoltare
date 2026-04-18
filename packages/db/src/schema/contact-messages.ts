import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const contactMessageStatus = pgEnum("contact_message_status", ["received", "triaged", "resolved"]);

export const contactMessages = pgTable("contact_messages", {
  company: varchar("company", { length: 120 }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  message: text("message").notNull(),
  name: varchar("name", { length: 80 }).notNull(),
  status: contactMessageStatus("status").default("received").notNull(),
});
