import { drizzle } from "drizzle-orm/mysql2";
import { blogPosts } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const samplePosts = [
  {
    slug: "getting-started-with-ai-automation",
    title: "מתחילים עם אוטומציית AI",
    excerpt: "מדריך מקיף למי שרוצה להתחיל לשלב אוטומציה ו-AI בעסק שלו",
    content: "תוכן המאמר המלא כאן...",
    author: "אוהד יאיר",
    publishedAt: new Date("2024-10-10"),
    updatedAt: new Date("2024-10-10"),
    isPublished: true,
    views: 0,
  },
];

async function seed() {
  console.log("🌱 Seeding blog posts...");
  for (const post of samplePosts) {
    await db.insert(blogPosts).values(post);
    console.log(`✅ Created post: ${post.title}`);
  }
  console.log("✨ Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
