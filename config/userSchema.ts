import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";


export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const SessionChatTable = pgTable('sessionChatTable', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar().notNull(),
  note: varchar().notNull(),
  conversation: json(),
  selectedDoctor: json(),
  report: json(),
  status: varchar().notNull(),
  createdBy: varchar({ length: 255 }).references(() => usersTable.email), 
  createdOn: varchar().notNull(),
});

