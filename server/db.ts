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
} from "../src/db/schema";
import { type LanguageCode } from "@shared/language";
import { ENV } from './_core/env';

let pool: mysql.Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      if (!pool) {
        pool = mysql.createPool(process.env.DATABASE_URL);
      }
      _db = drizzle(pool);
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

  const result = await db.insert(blogPosts).values(post);
  return result;
}


export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return { success: true };
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

