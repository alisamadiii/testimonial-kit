import {
  integer,
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  serial,
  jsonb,
  json,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const tasksTable = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey().notNull(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  status: text("status", {
    enum: ["active", "revoked", "expired"],
  }).default("active"),
  createdAt: timestamp("created_at"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export type ProjectField = {
  name: string;
  type: "input" | "textarea";
  required: boolean;
  minLength: number;
  maxLength: number;
  options: "HIDE_LENGTH"[];
};

export const projects = pgTable("projects", {
  id: text("id")
    .notNull()
    .unique()
    .default(sql`generate_project_id()`),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  createdAt: timestamp("created_at"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text("name").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  status: text("status", {
    enum: ["pending", "approved", "archived"],
  }).default("pending"),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
});

export const analytics = pgTable("analytics", {
  projectId: text("project_id")
    .notNull()
    .primaryKey()
    .references(() => projects.id, { onDelete: "cascade" }),
  totalTestimonials: integer("total_testimonials").notNull().default(0),
  totalTestimonialsApproved: integer("total_testimonials_approved")
    .notNull()
    .default(0),
  totalViews: integer("total_views").notNull().default(0),
  dateTestimonials: json("date_testimonials")
    .$type<Array<{ date: string; count: number } | null>>()
    .notNull()
    .default(sql`'[]'::json`),
});

export type Task = typeof tasksTable.$inferSelect;
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type ApiKeyInsert = typeof apiKeys.$inferInsert;
export type Project = typeof projects.$inferSelect & {
  analytics: typeof analytics.$inferSelect;
};
export type ProjectInsert = typeof projects.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type TestimonialInsert = typeof testimonials.$inferInsert;
export type Analytics = typeof analytics.$inferSelect;
