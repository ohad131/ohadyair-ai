import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, contactSubmissions, InsertContactSubmission, blogPosts, BlogPost, InsertBlogPost, aiTools, AITool, InsertAITool, siteContent, SiteContent, InsertSiteContent, projects, Project, InsertProject } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
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
export async function getSiteContent(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const result = await db
    .select()
    .from(siteContent)
    .where(eq(siteContent.key, key))
    .limit(1);

  return result.length > 0 ? result[0].value : null;
}

export async function setSiteContent(key: string, value: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Upsert
  const existing = await getSiteContent(key);
  if (existing) {
    await db
      .update(siteContent)
      .set({ value, updatedAt: new Date() })
      .where(eq(siteContent.key, key));
  } else {
    await db.insert(siteContent).values({ key, value });
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

