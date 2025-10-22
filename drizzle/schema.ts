import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Contact form submissions table
 */
export const contactSubmissions = mysqlTable("contactSubmissions", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  isRead: boolean("isRead").default(false).notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

/**
 * Blog posts table
 */
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").primaryKey().autoincrement(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: varchar("coverImage", { length: 500 }),
  author: varchar("author", { length: 255 }).notNull(),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  views: int("views").default(0).notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * AI Tools table - for Hero animation tiles
 */
export const aiTools = mysqlTable("aiTools", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  color: varchar("color", { length: 50 }).notNull(), // RGB format: "255, 100, 50"
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
});

export type AITool = typeof aiTools.$inferSelect;
export type InsertAITool = typeof aiTools.$inferInsert;

/**
 * Site content table - for editable content (About, images, etc.)
 */
export const siteContent = mysqlTable("siteContent", {
  id: int("id").primaryKey().autoincrement(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = typeof siteContent.$inferInsert;

