import {
  bigint,
  boolean,
  customType,
  int,
  longtext,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const SUPPORTED_LANGUAGES = ["he", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

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
  passwordHash: varchar("passwordHash", { length: 255 }),
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
const toBuffer = (value: Buffer | Uint8Array | ArrayBuffer): Buffer => {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) {
    return Buffer.from(value);
  }
  return Buffer.from(new Uint8Array(value));
};

const longBlob = customType<{ data: Buffer; driverData: Buffer | Uint8Array | ArrayBuffer }>({
  dataType() {
    return "longblob";
  },
  toDriver(value) {
    return toBuffer(value);
  },
  fromDriver(value) {
    return toBuffer(value);
  },
});

export const files = mysqlTable(
  "files",
  {
    id: varchar("id", { length: 26 }).primaryKey(),
    filename: varchar("filename", { length: 255 }).notNull(),
    mimeType: varchar("mimeType", { length: 128 }).notNull(),
    size: bigint("size", { mode: "number" }).notNull(),
    bytes: longBlob("bytes").notNull(),
    sha256: varchar("sha256", { length: 64 }).notNull(),
    uploadedBy: varchar("uploadedBy", { length: 191 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    sha256Idx: uniqueIndex("files_sha256_unique").on(table.sha256),
  })
);

export type MediaFile = typeof files.$inferSelect;
export type InsertMediaFile = typeof files.$inferInsert;

export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").primaryKey().autoincrement(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: varchar("coverImage", { length: 500 }),
  coverFileId: varchar("coverFileId", { length: 26 }).references(() => files.id, {
    onDelete: "set null",
  }),
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
export const siteContent = mysqlTable(
  "siteContent",
  {
    id: int("id").primaryKey().autoincrement(),
    key: varchar("key", { length: 100 }).notNull(),
    language: mysqlEnum("language", SUPPORTED_LANGUAGES).notNull().default("he"),
    value: text("value").notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  table => ({
    keyLanguageUnique: uniqueIndex("siteContent_key_language_unique").on(
      table.key,
      table.language
    ),
  })
);

export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = typeof siteContent.$inferInsert;

/**
 * Projects table
 */
export const projects = mysqlTable("projects", {
  id: int("id").primaryKey().autoincrement(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  title: varchar("title", { length: 191 }).notNull(),
  excerpt: text("excerpt"),
  content: longtext("content"),
  isPublished: boolean("isPublished").default(false).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  coverImage: varchar("coverImage", { length: 500 }),
  coverFileId: varchar("coverFileId", { length: 26 }).references(() => files.id, {
    onDelete: "set null",
  }),
  technologies: text("technologies"), // JSON array of tech tags
  projectUrl: varchar("projectUrl", { length: 500 }),
  githubUrl: varchar("githubUrl", { length: 500 }),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

export const blogPostFiles = mysqlTable(
  "blog_post_files",
  {
    blogPostId: int("blogPostId")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    fileId: varchar("fileId", { length: 26 })
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
  },
  table => ({
    pk: primaryKey({ columns: [table.blogPostId, table.fileId] }),
  })
);

export type BlogPostFile = typeof blogPostFiles.$inferSelect;
export type InsertBlogPostFile = typeof blogPostFiles.$inferInsert;

export const projectFiles = mysqlTable(
  "project_files",
  {
    projectId: int("projectId")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    fileId: varchar("fileId", { length: 26 })
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
  },
  table => ({
    pk: primaryKey({ columns: [table.projectId, table.fileId] }),
  })
);

export type ProjectFile = typeof projectFiles.$inferSelect;
export type InsertProjectFile = typeof projectFiles.$inferInsert;

