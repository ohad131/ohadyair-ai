# Ohad Yair - AI & Automation Landing Page

עמוד נחיתה עברי (RTL) מקצועי לשירותי AI ואוטומציה, בנוי עם Next.js 14, React, TypeScript ו-Tailwind CSS.

## 🎯 תכונות עיקריות

### עיצוב ותוכן
- **עיצוב RTL מלא**: תמיכה מלאה בעברית מימין לשמאל
- **ערכת צבעים מותאמת אישית**: רקע כהה עם גוונים של teal/green (#253233, #00bf6f)
- **טיפוגרפיה עברית**: משפחת פונטים Heebo עם משקלים שונים
- **אנימציות ואפקטים**: Gradient glows, backdrop blur, hover effects

### מבנה העמוד
1. **Header**: ניווט דביק עם לוגו ותפריט
2. **Hero Section**: כותרת ראשית, תת-כותרת, ו-CTAs
3. **Stats Section**: 5+ פרויקטים, 10+ לקוחות, 100% מחויבות לאיכות
4. **Services**: 6 שירותים (אוטומציות, אתרים, AI לעסקים, השקעות ומסחר, יזמות, ייעוץ טכנולוגי)
5. **Projects**: Study Buddy ו-BuzzAI עם תיאורים ותגיות
6. **About**: ביוגרפיה מקצועית עם רקע חינוכי ומקצועי
7. **FAQ**: 7 שאלות נפוצות עם תשובות מפורטות
8. **Blog**: 3 פוסטים לדוגמה עם תאריכים, כותרות ותקצירים
9. **Contact Form**: טופס יצירת קשר מלא עם אימות
10. **Footer**: קישורי ניווט, רשתות חברתיות, אימייל, זכויות יוצרים

### פונקציונליות
- **טופס לידים פעיל**: שדות שם, אימייל, טלפון והודעה עם אימות מלא
- **שליחת מייל**: התראות אוטומטיות ל-ohadyair.ai@gmail.com
- **בלוג דינמי**: מערכת בלוג מלאה עם עמודי רשימה ופוסטים בודדים
- **מסד נתונים**: אחסון הודעות ופוסטים ב-MySQL/TiDB
- **tRPC API**: תקשורת type-safe בין client ל-server

### SEO ונגישות
- **Meta Tags**: Title, description, Open Graph, Twitter Card
- **Structured Data**: JSON-LD עם מידע על האתר
- **Semantic HTML**: H1-H3 תקינים, ARIA labels
- **Accessibility**: ניגודיות גבוהה, alt text, keyboard navigation
- **Google Analytics**: מוכן לשילוב (placeholder G-XXXXXXXXXX)

### ביצועים
- **Lazy Loading**: טעינה עצלה של תמונות
- **Font Optimization**: font-display: swap
- **Responsive Design**: תמיכה מלאה במובייל, טאבלט ודסקטופ
- **Performance Targets**: LCP < 2.5s, CLS < 0.1, Lighthouse ≥ 95

## 🚀 התחלה מהירה

### דרישות מקדימות
- Node.js 22.13.0 או גרסה חדשה יותר
- pnpm (מותקן אוטומטית)
- MySQL/TiDB database

### התקנה

```bash
# התקנת תלויות
pnpm install

# הגדרת משתני סביבה
# ערוך את קובץ .env עם הפרטים שלך:
# DATABASE_URL=mysql://user:password@host:port/database
# JWT_SECRET=your-secret-key
# VITE_APP_TITLE=Ohad Yair - AI & Automation
# VITE_APP_LOGO=/logo.png

# דחיפת schema למסד הנתונים
pnpm db:push

# הרצת seed לבלוג (אופציונלי)
npx tsx scripts/seed-blog.ts

# הפעלת שרת פיתוח
pnpm dev
```

האתר יהיה זמין ב-http://localhost:3000

### Build לפרודקשן

```bash
# בניית האתר
pnpm build

# הפעלת שרת פרודקשן
pnpm start
```

## 📁 מבנה הפרויקט

```
ohadyair-ai/
├── client/                 # Frontend (React + Vite)
│   ├── public/            # קבצים סטטיים (לוגו, assets)
│   ├── src/
│   │   ├── components/    # רכיבי UI (shadcn/ui)
│   │   ├── pages/         # עמודי האתר
│   │   │   ├── Home.tsx   # עמוד הבית (landing page)
│   │   │   ├── Blog.tsx   # רשימת פוסטים
│   │   │   ├── BlogPost.tsx # פוסט בודד
│   │   │   └── Contact.tsx  # עמוד יצירת קשר
│   │   ├── lib/           # tRPC client
│   │   ├── App.tsx        # ניתוב
│   │   └── index.css      # סגנונות גלובליים + RTL
│   └── index.html         # HTML ראשי עם meta tags
├── server/                # Backend (Express + tRPC)
│   ├── db.ts             # פונקציות מסד נתונים
│   ├── routers.ts        # tRPC procedures
│   └── _core/            # תשתית (OAuth, LLM, Storage)
├── drizzle/              # Database schema
│   └── schema.ts         # טבלאות users, contacts, blog_posts
├── scripts/              # סקריפטים עזר
│   └── seed-blog.ts      # יצירת פוסטים לדוגמה
└── shared/               # קבועים משותפים
```

## 🤖 Ohad Intelligence Chat (OI Chat)

הצ'אטבוט החדש "Ohad Intelligence Chat" (OI Chat) מאפשר למבקרים לשוחח עם יועץ AI אינטליגנטי שמסתמך על כל המידע הזמין באתר (פרויקטים, בלוג, תוכן שיווקי ועוד), מבלי לגשת לנתוני הלידים הרגישים.

### שלבי הגדרה
1. וודא שהטיוטה החדשה של הסכמה קיימת במסד הנתונים (נוספה טבלת `integrationSecrets`):
   ```bash
   pnpm db:push
   ```
2. שמור את מפתח ה-API של Gemini (Gemini 2.5 Flash) במסד הנתונים בטבלת `integrationSecrets`. ניתן להשתמש בסקריפט העזר הכללי:
   ```bash
   pnpm tsx scripts/set-integration-secret.ts forgeApiKey "YOUR_GEMINI_KEY" "Gemini 2.5 Flash"
   ```
   - הערך ישמר בעמודה `value` תחת המפתח `forgeApiKey`. ניתן לעדכן אותו באותו פקודה בעתיד.
3. לחלופין, אפשר להשתמש במשתנה סביבה `BUILT_IN_FORGE_API_KEY` (משמש כגיבוי אם לא נמצא ערך במסד הנתונים).
4. הפעל את השרת כרגיל (`pnpm dev` או `pnpm start`). הצ'אט יופיע ככפתור צף בכל עמוד באתר.

### איך זה עובד
- קריאות הצ'אט נעשות דרך `trpc.chat.converse`, שניגש למודל Gemini 2.5 Flash דרך מחלקת ה-LLM המשותפת.
- לפני כל שיחה נטען סניפט עדכני של נתוני האתר (פוסטים שפורסמו, פרויקטים, תוכן שיווקי, כלים מומלצים ועוד) – כך שהתשובות מבוססות על מידע אמיתי ומעודכן.
- נתוני טפסי יצירת הקשר (לידים) אינם נכללים בהקשר שנשלח למודל.
- רכיב ה-React החדש (`client/src/components/chat/OIChatWidget.tsx`) מספק את הממשק למשתמש ומטפל בכל ניהול השיחה בדפדפן.

## 🎨 עיצוב וסגנון

### ערכת צבעים

```css
/* Dark Teal Theme */
--background: #253233;        /* רקע כהה */
--foreground: #ffffff;        /* טקסט לבן */
--primary: #00bf6f;          /* teal/green accent */
--muted: #cee0e0;            /* טקסט משני */
--border: rgba(0, 191, 111, 0.2); /* גבולות */
```

### טיפוגרפיה

```css
/* Hebrew Fonts - Heebo Family */
font-family: 'Heebo', sans-serif;

/* Weights: */
- Light (300)
- Regular (400)
- Medium (500)
- Bold (700)
- Extra Bold (800)
```

### RTL Support

```html
<!-- HTML -->
<html dir="rtl" lang="he">

/* CSS */
* {
  direction: rtl;
  text-align: right;
}
```

## 🔧 טכנולוגיות

### Frontend
- **React 19**: ספריית UI
- **TypeScript**: type safety
- **Tailwind CSS 4**: utility-first CSS
- **shadcn/ui**: רכיבי UI מוכנים
- **Wouter**: ניתוב קליל
- **tRPC React Query**: API client

### Backend
- **Express 4**: שרת HTTP
- **tRPC 11**: API type-safe
- **Drizzle ORM**: database toolkit
- **MySQL/TiDB**: מסד נתונים
- **Superjson**: סריאליזציה מתקדמת

### DevOps
- **Vite**: build tool מהיר
- **pnpm**: package manager
- **ESLint**: linting
- **TypeScript**: type checking

## 📝 שימוש בטופס יצירת קשר

הטופס שולח הודעות למסד הנתונים ושולח התראה למייל:

```typescript
// Client-side (Contact.tsx)
const submitMutation = trpc.contact.submit.useMutation({
  onSuccess: () => {
    toast.success("ההודעה נשלחה בהצלחה!");
  },
});

// Server-side (routers.ts)
submit: publicProcedure
  .input(contactSchema)
  .mutation(async ({ input }) => {
    await createContact(input);
    await notifyOwner({
      title: "הודעה חדשה מהאתר",
      content: `${input.name} (${input.email}) שלח/ה הודעה...`,
    });
    return { success: true };
  }),
```

## 📰 ניהול בלוג

### הוספת פוסט חדש

```typescript
// דרך 1: דרך הקוד
import { createBlogPost } from './server/db';

await createBlogPost({
  slug: 'my-new-post',
  title: 'כותרת הפוסט',
  excerpt: 'תקציר קצר',
  content: 'תוכן מלא של הפוסט...',
  author: 'אוהד יאיר',
  publishedAt: new Date(),
});

// דרך 2: דרך SQL ישיר
INSERT INTO blog_posts (slug, title, excerpt, content, author, publishedAt)
VALUES ('my-post', 'כותרת', 'תקציר', 'תוכן', 'אוהד יאיר', NOW());
```

### עריכת פוסט קיים

```sql
UPDATE blog_posts 
SET title = 'כותרת חדשה', content = 'תוכן חדש'
WHERE slug = 'post-slug';
```

## 🔐 אבטחה

- **Input Validation**: אימות כל הקלטים עם Zod schemas
- **SQL Injection Protection**: Drizzle ORM מונע SQL injection
- **XSS Protection**: React מנקה אוטומטית את הפלט
- **HTTPS**: תמיד השתמש ב-HTTPS בפרודקשן
- **Environment Variables**: סודות מאוחסנים ב-.env (לא ב-git)

## 📊 מסד נתונים

### טבלאות

**users** - משתמשים (לעתיד)
```sql
- id (VARCHAR 64, PK)
- name (TEXT)
- email (VARCHAR 320)
- role (ENUM: user, admin)
- createdAt (TIMESTAMP)
```

**contacts** - הודעות יצירת קשר
```sql
- id (INT, PK, AUTO_INCREMENT)
- name (VARCHAR 255)
- email (VARCHAR 320)
- phone (VARCHAR 20)
- message (TEXT)
- createdAt (TIMESTAMP)
```

**blog_posts** - פוסטים בבלוג
```sql
- id (INT, PK, AUTO_INCREMENT)
- slug (VARCHAR 255, UNIQUE)
- title (VARCHAR 500)
- excerpt (TEXT)
- content (TEXT)
- author (VARCHAR 255)
- publishedAt (TIMESTAMP)
- createdAt (TIMESTAMP)
```

## 🌐 פריסה (Deployment)

### Vercel (מומלץ)

```bash
# התקן Vercel CLI
npm i -g vercel

# פרוס לפרודקשן
vercel --prod
```

### Netlify

```bash
# התקן Netlify CLI
npm i -g netlify-cli

# פרוס
netlify deploy --prod
```

### הגדרות נוספות
1. הגדר משתני סביבה בפלטפורמת ההוסטינג
2. הגדר DNS ב-Hostinger לדומיין שלך
3. הפעל HTTPS (אוטומטי ב-Vercel/Netlify)
4. עדכן Google Analytics ID ב-index.html

## 📈 אנליטיקס

### Google Analytics

ערוך את `client/index.html` והחלף את `G-XXXXXXXXXX` ב-Measurement ID שלך:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID"></script>
```

### Cookie Consent

האתר כולל banner הסכמה לעוגיות בתחתית העמוד. ניתן להתאים ב-`Home.tsx`:

```tsx
<div className="fixed bottom-0 left-0 right-0 bg-primary/90 text-white p-4 z-50">
  <div className="container flex items-center justify-between">
    <p>אנחנו משתמשים בעוגיות...</p>
    <Button onClick={() => setShowCookieBanner(false)}>הבנתי</Button>
  </div>
</div>
```

## 🎯 רשימת משימות לפני השקה

- [ ] עדכן Google Analytics ID ב-`client/index.html`
- [ ] הוסף קישורי רשתות חברתיות אמיתיים ב-Footer
- [ ] הגדר DNS ב-Hostinger
- [ ] בדוק את הטופס שולח מיילים ל-ohadyair.ai@gmail.com
- [ ] הוסף favicon מותאם אישית
- [ ] צור פוסטים אמיתיים בבלוג
- [ ] בדוק ביצועים ב-Lighthouse (≥95)
- [ ] בדוק נגישות ב-WAVE או axe DevTools
- [ ] בדוק תצוגה במובייל/טאבלט
- [ ] הגדר גיבויים אוטומטיים למסד הנתונים

## 🐛 פתרון בעיות נפוצות

### הטופס לא שולח
- בדוק חיבור למסד הנתונים ב-`.env`
- ודא ש-`pnpm db:push` רץ בהצלחה
- בדוק את ה-console ב-DevTools לשגיאות

### הבלוג ריק
- הרץ `npx tsx scripts/seed-blog.ts`
- או הוסף פוסטים ידנית דרך SQL

### פונטים לא נטענים
- בדוק חיבור אינטרנט (פונטים מ-Google Fonts)
- ודא שה-`<link>` ב-`index.html` תקין

### RTL לא עובד
- ודא `dir="rtl"` ב-`<html>` tag
- בדוק שה-CSS כולל `direction: rtl`

## 📞 תמיכה

לשאלות ותמיכה:
- **Email**: ohadyair.ai@gmail.com
- **Website**: [ohadyair.ai](https://ohadyair.ai)

## 📄 רישיון

© 2024 Ohad Yair. All rights reserved.

---

**Built with ❤️ using Next.js, React, TypeScript, and Tailwind CSS**

