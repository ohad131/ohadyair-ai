import "dotenv/config";
import axios from "axios";
import crypto from "crypto";
import mysql from "mysql2/promise";
import { nanoid } from "nanoid";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import {
  blogPostFiles,
  blogPosts,
  files,
  projectFiles,
  projects,
  type InsertBlogPost,
  type InsertProject,
} from "../src/db/schema";

const SAMPLE_MEDIA = [
  {
    filename: "workspace-1200x800.jpg",
    url: "https://picsum.photos/seed/workspace/1200/800",
    mimeType: "image/jpeg",
  },
  {
    filename: "team-1000x600.jpg",
    url: "https://picsum.photos/seed/teamcollab/1000/600",
    mimeType: "image/jpeg",
  },
  {
    filename: "automation-800x800.jpg",
    url: "https://picsum.photos/seed/automation/800/800",
    mimeType: "image/jpeg",
  },
  {
    filename: "dashboard-900x600.jpg",
    url: "https://picsum.photos/seed/dashboard/900/600",
    mimeType: "image/jpeg",
  },
  {
    filename: "creative-700x500.jpg",
    url: "https://picsum.photos/seed/creative/700/500",
    mimeType: "image/jpeg",
  },
  {
    filename: "showcase.mp4",
    url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    mimeType: "video/mp4",
  },
] as const;

const PLACEHOLDER_IMAGE = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=",
  "base64"
);

interface StoredFile {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  sha256: string;
}

async function downloadMedia(url: string): Promise<Buffer> {
  const response = await axios.get<ArrayBuffer>(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
}

async function ensureFile(
  db: ReturnType<typeof drizzle>,
  source: (typeof SAMPLE_MEDIA)[number]
): Promise<StoredFile | null> {
  let buffer: Buffer | null = null;
  try {
    buffer = await downloadMedia(source.url);
  } catch (error) {
    if (source.mimeType.startsWith("image/")) {
      console.warn(`⚠️  Failed to download ${source.url}, using placeholder image.`);
      buffer = PLACEHOLDER_IMAGE;
    } else {
      console.warn(`⚠️  Failed to download ${source.url}, skipping media.`);
      return null;
    }
  }

  const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
  const existing = await db
    .select()
    .from(files)
    .where(eq(files.sha256, sha256))
    .limit(1);

  if (existing[0]) {
    console.log(`ℹ️  Using existing file ${existing[0].filename}`);
    return {
      id: existing[0].id,
      filename: existing[0].filename,
      mimeType: existing[0].mimeType,
      size: existing[0].size,
      sha256: existing[0].sha256,
    };
  }

  const id = nanoid(26);
  await db.insert(files).values({
    id,
    filename: source.filename,
    mimeType: source.mimeType,
    size: buffer.length,
    bytes: buffer,
    sha256,
    uploadedBy: "seed-media",
  });

  console.log(`✅ Inserted file ${source.filename}`);

  return {
    id,
    filename: source.filename,
    mimeType: source.mimeType,
    size: buffer.length,
    sha256,
  };
}

async function ensureBlogPost(
  db: ReturnType<typeof drizzle>,
  post: Omit<InsertBlogPost, "id"> & { slug: string }
) {
  const existing = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, post.slug))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  await db.insert(blogPosts).values(post);
  const created = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, post.slug))
    .limit(1);
  console.log(`✅ Inserted blog post ${post.title}`);
  return created[0]!;
}

async function ensureProject(
  db: ReturnType<typeof drizzle>,
  project: Omit<InsertProject, "id"> & { slug: string }
) {
  const existing = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, project.slug))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  await db.insert(projects).values(project);
  const created = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, project.slug))
    .limit(1);
  console.log(`✅ Inserted project ${project.title}`);
  return created[0]!;
}

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const pool = await mysql.createPool(process.env.DATABASE_URL);
  const db = drizzle(pool);

  const blogSeeds: Array<Omit<InsertBlogPost, "id"> & { slug: string }> = [
    {
      slug: "ai-automation-strategies",
      title: "אסטרטגיות מובילות לאוטומציית AI",
      excerpt: "כיצד להטמיע מערכות AI שמייצרות החזר השקעה אמיתי לעסק שלך.",
      content:
        "<p>בעידן של היום, שימוש ב-AI מאפשר למנף נתונים ולבנות תהליכים יעילים יותר. מדריך זה מציג שלבים מעשיים להטמעה מוצלחת.</p>",
      author: "אוהד יאיר",
      coverImage: null,
      coverFileId: null,
      isPublished: true,
      isFeatured: true,
      views: 0,
      publishedAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      slug: "building-automation-teams",
      title: "בניית צוות אוטומציה מנצח",
      excerpt: "טיפים מעשיים לבניית צוות שמוביל פרויקטי אוטומציה ו-AI מורכבים.",
      content:
        "<p>הצלחה בפרויקטי אוטומציה תלויה בצוות נכון. נסביר כיצד לבחור תפקידים, מיומנויות וכלי עבודה.</p>",
      author: "אוהד יאיר",
      coverImage: null,
      coverFileId: null,
      isPublished: true,
      isFeatured: false,
      views: 0,
      publishedAt: new Date("2024-02-20"),
      updatedAt: new Date("2024-02-20"),
    },
  ];

  const projectSeeds: Array<Omit<InsertProject, "id"> & { slug: string }> = [
    {
      slug: "automation-dashboard",
      title: "Automation Dashboard",
      excerpt: "פלטפורמה מאוחדת לניהול תהליכי אוטומציה בזמן אמת.",
      content:
        "<p>המערכת אוספת נתונים ממקורות שונים ומאפשרת בקרה מלאה על תהליכים קריטיים.</p>",
      coverImage: null,
      coverFileId: null,
      technologies: JSON.stringify(["React", "Node.js", "n8n"]),
      projectUrl: "https://example.com/dashboard",
      githubUrl: "https://github.com/example/dashboard",
      displayOrder: 1,
      isPublished: true,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: "ai-content-studio",
      title: "AI Content Studio",
      excerpt: "מערכת שמייצרת ומנתחת תוכן שיווקי בעזרת מודלים חכמים.",
      content:
        "<p>מערכת חכמה שמסייעת לצוותי שיווק לייצר תכנים מותאמים אישית במהירות.</p>",
      coverImage: null,
      coverFileId: null,
      technologies: JSON.stringify(["Next.js", "OpenAI", "Supabase"]),
      projectUrl: "https://example.com/content-studio",
      githubUrl: "https://github.com/example/content-studio",
      displayOrder: 2,
      isPublished: true,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const posts = [] as Awaited<ReturnType<typeof ensureBlogPost>>[];
  for (const seed of blogSeeds) {
    posts.push(await ensureBlogPost(db, seed));
  }

  const projectRecords = [] as Awaited<ReturnType<typeof ensureProject>>[];
  for (const seed of projectSeeds) {
    projectRecords.push(await ensureProject(db, seed));
  }

  const storedFiles: StoredFile[] = [];
  for (const source of SAMPLE_MEDIA) {
    const file = await ensureFile(db, source);
    if (file) storedFiles.push(file);
  }

  const imageFiles = storedFiles.filter(file => file.mimeType.startsWith("image/"));
  const videoFiles = storedFiles.filter(file => file.mimeType.startsWith("video/"));

  if (posts[0] && imageFiles[0]) {
    await db
      .update(blogPosts)
      .set({ coverFileId: imageFiles[0].id, updatedAt: new Date() })
      .where(eq(blogPosts.id, posts[0].id));
    const attachments = imageFiles.slice(0, 3);
    if (attachments.length > 0) {
      await db
        .insert(blogPostFiles)
        .values(attachments.map(file => ({ blogPostId: posts[0].id, fileId: file.id })))
        .onDuplicateKeyUpdate({ set: {} });
      console.log(`🔗 Attached media to blog post ${posts[0].slug}`);
    }
  }

  if (posts[1] && imageFiles[3]) {
    await db
      .update(blogPosts)
      .set({ coverFileId: imageFiles[3].id, updatedAt: new Date() })
      .where(eq(blogPosts.id, posts[1].id));
    const attachments = imageFiles.slice(2, 5);
    if (attachments.length > 0) {
      await db
        .insert(blogPostFiles)
        .values(attachments.map(file => ({ blogPostId: posts[1].id, fileId: file.id })))
        .onDuplicateKeyUpdate({ set: {} });
      console.log(`🔗 Attached media to blog post ${posts[1].slug}`);
    }
  }

  if (projectRecords[0] && imageFiles[1]) {
    await db
      .update(projects)
      .set({ coverFileId: imageFiles[1].id, updatedAt: new Date() })
      .where(eq(projects.id, projectRecords[0].id));
    const attachments = [imageFiles[1], imageFiles[2], videoFiles[0]].filter(Boolean) as StoredFile[];
    if (attachments.length > 0) {
      await db
        .insert(projectFiles)
        .values(attachments.map(file => ({ projectId: projectRecords[0].id, fileId: file.id })))
        .onDuplicateKeyUpdate({ set: {} });
      console.log(`🔗 Attached media to project ${projectRecords[0].slug}`);
    }
  }

  if (projectRecords[1] && imageFiles[4]) {
    await db
      .update(projects)
      .set({ coverFileId: imageFiles[4].id, updatedAt: new Date() })
      .where(eq(projects.id, projectRecords[1].id));
    const attachments = imageFiles.slice(0, 3);
    if (attachments.length > 0) {
      await db
        .insert(projectFiles)
        .values(attachments.map(file => ({ projectId: projectRecords[1].id, fileId: file.id })))
        .onDuplicateKeyUpdate({ set: {} });
      console.log(`🔗 Attached media to project ${projectRecords[1].slug}`);
    }
  }

  console.log("✨ Media seeding complete");
  await pool.end();
}

run().catch(error => {
  console.error("❌ Failed to seed media", error);
  process.exit(1);
});
