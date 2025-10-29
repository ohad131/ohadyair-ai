import 'dotenv/config';
import { getDb, setSiteContent } from "../server/db";
import { SUPPORTED_LANGUAGE_CODES } from "@shared/language";

const DEFAULTS: Record<string, Record<string, string>> = {
  he: {
    aboutCard1Title: "כלכלה וניהול",
    aboutCard1Subtitle: "סטודנט",
    aboutCard2Title: "מכטרוניקה",
    aboutCard2Subtitle: "פרקטי-הנדסאי",
    aboutCard3Title: "מעצב מכני",
    aboutCard3Subtitle: "צה" + String.fromCharCode(34) + "ל (לשעבר)",
    aboutCard4Title: "יזם AI",
    aboutCard4Subtitle: "נוכחי",
    service1Title: "אוטומציה תהליכית (n8n)",
    service1Desc: "תהליכים חכמים לחיסכון בזמן ועלויות",
    service2Title: "AI לעסקים",
    service2Desc: "הטמעת פתרונות בינה מלאכותית",
    service3Title: "פיתוח פתרונות מותאמים",
    service3Desc: "בנייה ואינטגרציה של מערכות חכמות",
    service4Title: "בניית אתרים חכמים",
    service4Desc: "אתרים מודרניים עם חווית משתמש מתקדמת",
    service5Title: "ייעוץ אסטרטגי",
    service5Desc: "מיפוי צרכים ובניית תוכנית",
    service6Title: "DATA & BI",
    service6Desc: "ניתוח נתונים ותובנות",
  },
  en: {
    aboutCard1Title: "Economics & Management",
    aboutCard1Subtitle: "Student",
    aboutCard2Title: "Mechatronics",
    aboutCard2Subtitle: "Practical Engineer",
    aboutCard3Title: "Mechanical Designer",
    aboutCard3Subtitle: "IDF (Former)",
    aboutCard4Title: "AI Entrepreneur",
    aboutCard4Subtitle: "Current",
    service1Title: "Process Automation (n8n)",
    service1Desc: "Smart workflows to save time and costs",
    service2Title: "AI for Business",
    service2Desc: "Implementing AI solutions",
    service3Title: "Custom Solutions",
    service3Desc: "Building and integrating intelligent systems",
    service4Title: "Smart Websites",
    service4Desc: "Modern websites with great UX",
    service5Title: "Strategy Consulting",
    service5Desc: "Needs mapping and planning",
    service6Title: "DATA & BI",
    service6Desc: "Data analysis and insights",
  },
};

async function main() {
  const db = await getDb();
  if (!db) {
    console.warn("[seed-site-content] Database not available; skipping");
    return;
  }
  for (const lang of SUPPORTED_LANGUAGE_CODES) {
    const entries = DEFAULTS[lang] ?? {};
    for (const [key, value] of Object.entries(entries)) {
      await setSiteContent(key, lang as any, value);
      console.log(`[seed] ${lang}.${key}`);
    }
  }
  console.log("[seed-site-content] Done");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


