import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  InsertUser,
  users,
  contactSubmissions,
  InsertContactSubmission,
  blogPosts,
  BlogPost,
  InsertBlogPost,
  aiTools,
  AITool,
  InsertAITool,
  siteContent,
  projects,
  Project,
  InsertProject,
  images,
  Image,
  InsertImage,
  integrationSecrets,
  InsertIntegrationSecret,
} from "../src/db/schema";
import { type LanguageCode } from "@shared/language";
import { ENV } from './_core/env';

let pool: mysql.Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

const BASE64_HEADER_PATTERN = /^data:[^;]+;base64,/i;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      if (!pool) {
        pool = mysql.createPool(process.env.DATABASE_URL);
      }
      _db = drizzle(pool as any);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Contact form submissions
export async function createContactSubmission(submission: InsertContactSubmission) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(contactSubmissions).values(submission);
  return result;
}

export async function getAllContactSubmissions() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
}

export async function setContactSubmissionReadStatus(id: number, isRead: boolean) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(contactSubmissions)
    .set({ isRead })
    .where(eq(contactSubmissions.id, id));
}

// Blog posts
export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getAllBlogPostsAdmin() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.updatedAt));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function incrementBlogPostViews(slug: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const post = await getBlogPostBySlug(slug);
  if (!post) return;

  await db
    .update(blogPosts)
    .set({ views: (post.views || 0) + 1 })
    .where(eq(blogPosts.slug, slug));
}

export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const now = new Date();
  const values: InsertBlogPost = {
    ...post,
    coverImage: post.coverImage ?? null,
    publishedAt: post.publishedAt ?? now,
    updatedAt: now,
  };

  await db.insert(blogPosts).values(values);

  return await getBlogPostBySlug(post.slug);
}


export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return { success: true };
}

export async function updateBlogPost(
  id: number,
  data: Partial<InsertBlogPost>
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const updateSet: Partial<InsertBlogPost> = {};

  if (data.title !== undefined) {
    updateSet.title = data.title;
  }
  if (data.slug !== undefined) {
    updateSet.slug = data.slug;
  }
  if (data.excerpt !== undefined) {
    updateSet.excerpt = data.excerpt;
  }
  if (data.content !== undefined) {
    updateSet.content = data.content;
  }
  if (data.coverImage !== undefined) {
    updateSet.coverImage = data.coverImage ?? null;
  }
  if (data.author !== undefined) {
    updateSet.author = data.author;
  }
  if (data.isPublished !== undefined) {
    updateSet.isPublished = data.isPublished;
  }
  if (data.publishedAt !== undefined) {
    updateSet.publishedAt = data.publishedAt;
  }
  if (data.isFeatured !== undefined) {
    updateSet.isFeatured = data.isFeatured;
  }
  if (data.views !== undefined) {
    updateSet.views = data.views;
  }

  updateSet.updatedAt = new Date();

  await db.update(blogPosts).set(updateSet).where(eq(blogPosts.id, id));

  const result = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}



// AI Tools
export async function getAllAITools(): Promise<AITool[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(aiTools)
    .where(eq(aiTools.isActive, true))
    .orderBy(aiTools.displayOrder);
}

export async function updateAITool(id: number, data: Partial<InsertAITool>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(aiTools).set(data).where(eq(aiTools.id, id));
  return { success: true };
}

// Site Content
export async function getSiteContent(
  key: string,
  language: LanguageCode
): Promise<string | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const result = await db
    .select()
    .from(siteContent)
    .where(and(eq(siteContent.key, key), eq(siteContent.language, language)))
    .limit(1);

  return result.length > 0 ? result[0].value : null;
}

export async function getSiteContentByLanguage(language: LanguageCode) {
  const db = await getDb();
  if (!db) {
    return {} as Record<string, string>;
  }

  const rows = await db
    .select()
    .from(siteContent)
    .where(eq(siteContent.language, language));

  return rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

export async function getAllSiteContent() {
  const db = await getDb();
  if (!db) {
    return {} as Record<LanguageCode, Record<string, string>>;
  }

  const rows = await db.select().from(siteContent);
  return rows.reduce<Record<LanguageCode, Record<string, string>>>((acc, row) => {
    const language = row.language as LanguageCode;
    if (!acc[language]) {
      acc[language] = {};
    }
    acc[language]![row.key] = row.value;
    return acc;
  }, {} as Record<LanguageCode, Record<string, string>>);
}

export async function setSiteContent(
  key: string,
  language: LanguageCode,
  value: string
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .insert(siteContent)
    .values({ key, language, value, updatedAt: new Date() })
    .onDuplicateKeyUpdate({
      set: { value, updatedAt: new Date() },
    });

  return { success: true };
}

export async function setSiteContentBatch(
  language: LanguageCode,
  entries: Array<{ key: string; value: string }>
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  for (const entry of entries) {
    await setSiteContent(entry.key, language, entry.value);
  }

  return { success: true };
}

export async function toggleBlogFeatured(id: number, isFeatured: boolean) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(blogPosts).set({ isFeatured }).where(eq(blogPosts.id, id));
  return { success: true };
}


// Images / Media Library

function normalizeBase64Data(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error("Image data is empty");
  }
  return trimmed.replace(BASE64_HEADER_PATTERN, "");
}

export async function createImageRecord(
  input: Pick<InsertImage, "fileName" | "mimeType"> & { base64Data: string }
): Promise<{ id: number }> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const data = normalizeBase64Data(input.base64Data);

  const result = await db.insert(images).values({
    fileName: input.fileName,
    mimeType: input.mimeType,
    data,
  });

  const insertHeader = result as unknown as mysql.ResultSetHeader;
  const insertId = Number(insertHeader.insertId ?? 0);
  if (!insertId) {
    const latest = await db
      .select({ id: images.id })
      .from(images)
      .orderBy(desc(images.id))
      .limit(1);
    if (!latest[0]) {
      throw new Error("Failed to determine new image ID");
    }
    return { id: Number(latest[0]!.id) };
  }

  return { id: insertId };
}

export async function getImageRecord(id: number): Promise<Image | null> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const rows = await db.select().from(images).where(eq(images.id, id)).limit(1);
  return rows.length > 0 ? rows[0] : null;
}

export async function listImageRecords(): Promise<Array<Omit<Image, "data">>> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const rows = await db
    .select({
      id: images.id,
      fileName: images.fileName,
      mimeType: images.mimeType,
      createdAt: images.createdAt,
    })
    .from(images)
    .orderBy(desc(images.createdAt));

  return rows.map(row => ({
    ...row,
  }));
}

export async function deleteImageRecord(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(images).where(eq(images.id, id));
  return { success: true };
}



// Projects
export async function getAllProjects(): Promise<Project[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }
  return await db
    .select()
    .from(projects)
    .where(eq(projects.isPublished, true))
    .orderBy(desc(projects.displayOrder), desc(projects.createdAt));
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(projects)
    .orderBy(desc(projects.updatedAt));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createProject(data: InsertProject) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  await db.insert(projects).values({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { success: true };
}

export async function updateProject(
  id: number,
  data: Partial<Omit<InsertProject, "id">>
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  if (Object.keys(data).length === 0) {
    throw new Error("No data provided for update");
  }

  await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id));

  return { success: true };
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  await db.delete(projects).where(eq(projects.id, id));
  return { success: true };
}

export async function toggleProjectFeatured(id: number, isFeatured: boolean) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  await db.update(projects).set({ isFeatured }).where(eq(projects.id, id));
  return { success: true };
}

// Integration Secrets
export async function getIntegrationSecretValue(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const rows = await db
    .select({ value: integrationSecrets.value })
    .from(integrationSecrets)
    .where(eq(integrationSecrets.key, key))
    .limit(1);

  return rows.length > 0 ? rows[0]!.value : null;
}

export async function setIntegrationSecret(secret: InsertIntegrationSecret): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .insert(integrationSecrets)
    .values({
      ...secret,
      updatedAt: new Date(),
    })
    .onDuplicateKeyUpdate({
      set: {
        label: secret.label,
        value: secret.value,
        updatedAt: new Date(),
      },
    });
}
