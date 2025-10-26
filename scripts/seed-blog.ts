import 'dotenv/config';
import mysql from 'mysql2/promise';
import { drizzle } from "drizzle-orm/mysql2";
import { blogPosts } from "../src/db/schema";

const samplePosts = [
  {
    slug: "getting-started-with-ai-automation",
    title: "מתחילים עם אוטומציית AI",
    excerpt: "מדריך מקיף למי שרוצה להתחיל לשלב אוטומציה ו-AI בעסק שלו",
    content: `
      <h2>מבוא</h2>
      <p>בעידן הדיגיטלי המודרני, אוטומציה ובינוי מלאכותי הפכו לכלים חיוניים לכל עסק שרוצה להישאר תחרותי. במאמר זה נסקור את הצעדים הראשונים לשילוב טכנולוגיות אלו בעסק שלכם.</p>

      <h2>למה אוטומציה ו-AI?</h2>
      <p>אוטומציה ו-AI מאפשרים:</p>
      <ul>
        <li>חיסכון בזמן ומשאבים</li>
        <li>הפחתת טעויות אנוש</li>
        <li>שיפור חווית הלקוח</li>
        <li>קבלת החלטות מבוססות נתונים</li>
      </ul>

      <h2>איך מתחילים?</h2>
      <p>הצעד הראשון הוא לזהות את התהליכים החוזרים בעסק שלכם שניתן לאוטמט. התחילו מהפשוט לפני שעוברים למורכב.</p>

      <h2>כלים מומלצים</h2>
      <p>ישנם מגוון כלים זמינים, כגון n8n, Zapier, Make, ועוד. בחרו כלי שמתאים לצרכים שלכם ולתקציב.</p>
    `,
    author: "אוהד יאיר",
    publishedAt: new Date("2024-10-10"),
    updatedAt: new Date("2024-10-10"),
    isPublished: true,
    views: 127,
  },
  {
    slug: "n8n-automation-guide",
    title: "מדריך למתחילים ב-n8n",
    excerpt: "למד איך להשתמש ב-n8n ליצירת אוטומציות מתקדמות ללא קוד",
    content: `
      <h2>מהו n8n?</h2>
      <p>n8n הוא כלי אוטומציה חזק ופתוח המאפשר ליצור זרימות עבודה מורכבות בלי לכתוב קוד.</p>

      <h2>יתרונות n8n</h2>
      <ul>
        <li>קוד פתוח - שליטה מלאה על הנתונים</li>
        <li>חינמי לשימוש עצמאי</li>
        <li>מאות אינטגרציות מובנות</li>
        <li>ממשק ויזואלי נוח</li>
      </ul>

      <h2>דוגמאות לשימוש</h2>
      <p>n8n מצוין עבור:</p>
      <ul>
        <li>סנכרון נתונים בין מערכות</li>
        <li>אוטומציה של דוחות</li>
        <li>טיפול בהודעות ואימיילים</li>
        <li>ניהול תהליכי שיווק</li>
      </ul>

      <h2>התחלה מהירה</h2>
      <p>כדי להתחיל עם n8n, תוכלו להתקין אותו לוקלית או להשתמש בגרסת הענן שלהם. המדריך המלא זמין באתר הרשמי.</p>
    `,
    author: "אוהד יאיר",
    publishedAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-10-15"),
    isPublished: true,
    views: 94,
  },
  {
    slug: "ai-business-transformation",
    title: "כיצד AI משנה את עולם העסקים",
    excerpt: "סקירה מעמיקה על ההשפעה של בינה מלאכותית על עסקים בעידן המודרני",
    content: `
      <h2>המהפכה הדיגיטלית</h2>
      <p>בינה מלאכותית משנה באופן יסודי את הדרך שבה עסקים פועלים, מקבלים החלטות, ומתקשרים עם לקוחות.</p>

      <h2>תחומים מרכזיים להשפעת AI</h2>

      <h3>1. שירות לקוחות</h3>
      <p>צ'אטבוטים חכמים ומערכות AI מספקים מענה מיידי ללקוחות 24/7, משפרים את חווית המשתמש ומקטינים עלויות.</p>

      <h3>2. ניתוח נתונים</h3>
      <p>AI מאפשר ניתוח כמויות עצומות של נתונים ומזהה דפוסים שבני אדם לא יכלו לזהות.</p>

      <h3>3. אוטומציה של תהליכים</h3>
      <p>משימות חוזרות ומשעממות מואצרות, ומאפשרות לעובדים להתמקד במשימות יצירתיות ואסטרטגיות.</p>

      <h2>עתיד העסקים עם AI</h2>
      <p>עסקים שמשלבים AI היום יהיו בעלי יתרון תחרותי משמעותי בעתיד. ההשקעה בטכנולוגיה זו היא השקעה בעתיד החברה.</p>
    `,
    author: "אוהד יאיר",
    publishedAt: new Date("2024-10-20"),
    updatedAt: new Date("2024-10-20"),
    isPublished: true,
    isFeatured: true,
    views: 203,
  },
];

async function seed() {
  console.log("🌱 Seeding blog posts...");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set");
    console.log("Please set DATABASE_URL in your .env file to seed the database.");
    process.exit(1);
  }

  const pool = await mysql.createPool(process.env.DATABASE_URL);
  const db = drizzle(pool);

  for (const post of samplePosts) {
    await db
      .insert(blogPosts)
      .values(post)
      .onDuplicateKeyUpdate({
        set: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          updatedAt: new Date(),
          isPublished: post.isPublished,
          isFeatured: post.isFeatured || false,
          views: post.views,
          // Note: slug is NOT updated as it's the unique key
          // Note: coverImage is NOT updated to preserve existing values
        }
      });

    console.log(`✅ Upserted post: ${post.title}`);
  }

  await pool.end();
  console.log("✨ Seeding complete (idempotent)!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
