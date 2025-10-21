import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { useState } from "react";

export default function Home() {
  const [showCookieBanner, setShowCookieBanner] = useState(true);

  return (
    <div className="min-h-screen">
      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <nav className="container mx-auto py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="w-14 h-14 glass-hover rounded-xl overflow-hidden flex items-center justify-center glow-cyan">
            <img src="/logo.png" alt="Ohad Yair Logo" className="w-full h-full object-contain p-2" />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-8 glass px-6 py-2 rounded-full">
            <a href="#home" className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all">
              בית
            </a>
            <a href="#services" className="text-secondary text-sm font-medium hover:text-primary transition-colors">
              שירותים
            </a>
            <a href="#projects" className="text-secondary text-sm font-medium hover:text-primary transition-colors">
              פרויקטים
            </a>
            <a href="#blog" className="text-secondary text-sm font-medium hover:text-primary transition-colors">
              בלוג
            </a>
            <a href="#about" className="text-secondary text-sm font-medium hover:text-primary transition-colors">
              אודות
            </a>
            <a href="#contact" className="text-secondary text-sm font-medium hover:text-primary transition-colors">
              צור קשר
            </a>
          </div>

          {/* CTA Button */}
          <Button className="liquid-button h-12 px-6 rounded-full text-white text-sm font-medium">
            <span>התחל עכשיו</span>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="none">
              <path d="M13.33 10L8.33 5L6.67 6.67L10 10L6.67 13.33L8.33 15L13.33 10Z" fill="currentColor" />
            </svg>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="container mx-auto py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Text */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-secondary leading-tight">
              בונה מערכות <span className="text-primary">AI</span> ואוטומציה שמייצרות אימפקט עסקי
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              ממפה תהליכים, מחבר דאטה, ומצמיח ביצועים בעזרת AI—בדיוק איפה שזה משנה.
            </p>
            <div className="flex gap-4">
              <Button className="liquid-button h-14 px-8 rounded-full text-white font-medium text-base">
                <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="none">
                  <path d="M15.83 10.83L11.83 14.83C11.64 15.02 11.39 15.13 11.13 15.13C10.87 15.13 10.62 15.02 10.43 14.83C10.04 14.44 10.04 13.81 10.43 13.42L12.34 11.5H4.5C3.95 11.5 3.5 11.05 3.5 10.5C3.5 9.95 3.95 9.5 4.5 9.5H12.34L10.43 7.58C10.04 7.19 10.04 6.56 10.43 6.17C10.82 5.78 11.45 5.78 11.84 6.17L15.84 10.17C16.22 10.56 16.22 11.19 15.83 10.83Z" fill="currentColor" />
                </svg>
                דברו איתי
              </Button>
              <Button variant="outline" className="h-14 px-8 glass glass-hover border-primary/30 rounded-full text-secondary font-medium text-base">
                צפה בעבודות
              </Button>
            </div>
          </div>

          {/* Hero Image with Glass Card */}
          <div className="relative">
            <Card className="glass glass-hover w-full h-[400px] rounded-2xl overflow-hidden glow-cyan">
              <div className="w-full h-full liquid-gradient flex items-center justify-center relative">
                <img src="/logo.png" alt="Ohad Yair" className="w-64 h-64 object-contain" />
              </div>
              <div className="absolute bottom-6 right-6 left-6">
                <div className="glass-dark p-6 rounded-xl">
                  <h3 className="text-white text-base font-semibold mb-2">מומחיות בפיתוח AI ואוטומציה</h3>
                  <p className="text-white/80 text-sm">משלב חשיבה עסקית עם יכולות טכניות מתקדמות ליצירת פתרונות שמניבים תוצאות.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="glass glass-hover p-6 rounded-2xl text-center">
            <div className="text-5xl font-bold text-primary mb-2">+5</div>
            <div className="text-sm text-secondary font-medium">פרויקטים מוצלחים</div>
          </div>
          <div className="glass glass-hover p-6 rounded-2xl text-center">
            <div className="text-5xl font-bold text-primary mb-2">+10</div>
            <div className="text-sm text-secondary font-medium">לקוחות מרוצים</div>
          </div>
          <div className="glass glass-hover p-6 rounded-2xl text-center">
            <div className="text-5xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-secondary font-medium">מחויבות לאיכות</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary mb-4">שירותים</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            פתרונות מותאמים אישית שמשלבים AI, אוטומציה וטכנולוגיות מתקדמות
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service 1: Automations */}
          <Card className="glass glass-hover p-8 group">
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all glow-cyan">
              <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-3">אוטומציות</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              בניית זרימות עבודה אוטומטיות עם n8n/Activepieces, חיבור API, וסקרייפינג מתקדם
            </p>
          </Card>

          {/* Service 2: Websites */}
          <Card className="glass glass-hover p-8 group">
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all glow-cyan">
              <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-3">אתרים</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              פיתוח אתרים תדמיתיים, מהירים ומותאמי SEO עם טכנולוגיות מודרניות
            </p>
          </Card>

          {/* Service 3: AI for Business */}
          <Card className="glass glass-hover p-8 group">
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all glow-cyan">
              <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-3">AI לעסקים</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              שילוב מודלי שפה, צ'אטבוטים חכמים, וכלי AI מותאמים לצרכים עסקיים
            </p>
          </Card>

          {/* Service 4: Investments & Trading */}
          <Card className="glass glass-hover p-8 group">
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all glow-cyan">
              <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-3">השקעות ומסחר</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              ניתוח דאטה פיננסי, כלי החלטה מבוססי AI, ואסטרטגיות מסחר מתקדמות
            </p>
          </Card>

          {/* Service 5: Entrepreneurship */}
          <Card className="glass glass-hover p-8 group">
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all glow-cyan">
              <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-3">יזמות</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              בניית MVP, ניסוי רעיונות, וליווי טכנולוגי לסטארטאפים ויזמים
            </p>
          </Card>

          {/* Service 6: Consulting */}
          <Card className="glass glass-hover p-8 group">
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all glow-cyan">
              <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-3">ייעוץ טכנולוגי</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              ייעוץ אסטרטגי לבחירת טכנולוגיות, אופטימיזציה של תהליכים, ושיפור ביצועים
            </p>
          </Card>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="container mx-auto py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary mb-4">פרויקטים נבחרים</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            דוגמאות לעבודות שביצעתי בתחומי AI, אוטומציה ופיתוח
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Project 1: Study Buddy */}
          <Card className="glass glass-hover overflow-hidden">
            <div className="h-48 liquid-gradient flex items-center justify-center">
              <div className="text-6xl">📚</div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-secondary mb-3">Study Buddy</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                פלטפורמת למידה חכמה מבוססת AI שמסייעת לסטודנטים ללמוד ביעילות, עם תכונות של סיכום חומרים, יצירת שאלות תרגול, והמלצות מותאמות אישית.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">AI</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">Education</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">Web App</span>
              </div>
            </div>
          </Card>

          {/* Project 2: BuzzAI */}
          <Card className="glass glass-hover overflow-hidden">
            <div className="h-48 liquid-gradient flex items-center justify-center">
              <div className="text-6xl">🤖</div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-secondary mb-3">BuzzAI</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                כלי אוטומציה לניהול תוכן ברשתות חברתיות, כולל יצירת תוכן בעזרת AI, תזמון פרסומים, וניתוח ביצועים בזמן אמת.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">AI</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">Automation</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">Social Media</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* About Image */}
          <div className="relative">
            <Card className="glass glass-hover w-full h-[500px] rounded-2xl overflow-hidden glow-cyan">
              <div className="w-full h-full liquid-gradient flex items-center justify-center">
                <img src="/logo.png" alt="Ohad Yair" className="w-80 h-80 object-contain" />
              </div>
            </Card>
          </div>

          {/* About Text */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-secondary mb-6">אודות אוהד</h2>
            <p className="text-muted-foreground leading-relaxed">
              אני אוהד יאיר, סטודנט לכלכלה וניהול ופרקטי-הנדסאי מכטרוניקה. בעבר שירתתי כמעצב מכני ביחידה טכנולוגית בצה"ל, שם פיתחתי יכולות של פתרון בעיות מורכבות וחשיבה מערכתית.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              היום אני מתמחה בבניית מערכות AI ואוטומציה שמייצרות ערך עסקי אמיתי. אני משלב ידע עסקי עם כישורים טכניים מתקדמים כדי ליצור פתרונות שמתאימים בדיוק לצרכי הלקוח.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              כיזם AI, אני תמיד מחפש הזדמנויות חדשות ללמוד, לצמוח ולעזור לאחרים להצליח בעידן הדיגיטלי.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="glass glass-hover p-4 rounded-xl text-center">
                <h4 className="text-primary font-bold text-lg mb-1">כלכלה וניהול</h4>
                <p className="text-sm text-muted-foreground">סטודנט</p>
              </div>
              <div className="glass glass-hover p-4 rounded-xl text-center">
                <h4 className="text-primary font-bold text-lg mb-1">מכטרוניקה</h4>
                <p className="text-sm text-muted-foreground">פרקטי-הנדסאי</p>
              </div>
              <div className="glass glass-hover p-4 rounded-xl text-center">
                <h4 className="text-primary font-bold text-lg mb-1">מעצב מכני</h4>
                <p className="text-sm text-muted-foreground">צה"ל (לשעבר)</p>
              </div>
              <div className="glass glass-hover p-4 rounded-xl text-center">
                <h4 className="text-primary font-bold text-lg mb-1">יזם AI</h4>
                <p className="text-sm text-muted-foreground">נוכחי</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary mb-4">שאלות נפוצות</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            תשובות לשאלות שמרבים לשאול
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <details className="glass glass-hover p-6 rounded-xl group">
            <summary className="cursor-pointer text-lg font-semibold text-secondary flex items-center justify-between">
              איך נראה תהליך העבודה?
              <svg className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              התהליך מתחיל בשיחת היכרות להבנת הצרכים, ממשיך בתכנון מפורט והצעת מחיר, ואז עובר לשלב הפיתוח עם עדכונים שוטפים. בסיום מתבצע מסירה מלאה עם הדרכה ותמיכה.
            </p>
          </details>

          <details className="glass glass-hover p-6 rounded-xl group">
            <summary className="cursor-pointer text-lg font-semibold text-secondary flex items-center justify-between">
              כמה זמן לוקח לפתח פרויקט?
              <svg className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              משך הזמן משתנה לפי היקף הפרויקט. פרויקט קטן יכול להסתיים תוך שבועיים, בעוד פרויקט מורכב יכול לקחת מספר חודשים. אני מספק הערכת זמן מדויקת לאחר שיחת ההיכרות.
            </p>
          </details>

          <details className="glass glass-hover p-6 rounded-xl group">
            <summary className="cursor-pointer text-lg font-semibold text-secondary flex items-center justify-between">
              האם יש תחזוקה לאחר המסירה?
              <svg className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              כן, אני מציע חבילות תחזוקה שונות שכוללות עדכונים, תיקוני באגים, ותמיכה טכנית. ניתן לבחור בחבילה המתאימה ביותר לצרכים שלך.
            </p>
          </details>

          <details className="glass glass-hover p-6 rounded-xl group">
            <summary className="cursor-pointer text-lg font-semibold text-secondary flex items-center justify-between">
              איך מטפלים בפרטיות ואבטחת מידע?
              <svg className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              אני מקפיד על סטנדרטים גבוהים של אבטחת מידע, כולל הצפנה, גיבויים קבועים, ועמידה בתקני GDPR. כל המידע מטופל בסודיות מוחלטת.
            </p>
          </details>

          <details className="glass glass-hover p-6 rounded-xl group">
            <summary className="cursor-pointer text-lg font-semibold text-secondary flex items-center justify-between">
              האם אפשר לראות דוגמאות נוספות?
              <svg className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              בהחלט! צור איתי קשר ואשמח להציג לך פרויקטים נוספים שביצעתי, כולל case studies מפורטים ותוצאות עסקיות.
            </p>
          </details>

          <details className="glass glass-hover p-6 rounded-xl group">
            <summary className="cursor-pointer text-lg font-semibold text-secondary flex items-center justify-between">
              מה כלול במחיר?
              <svg className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              המחיר כולל את כל שלבי הפיתוח, בדיקות איכות, מסירה מלאה, הדרכה בסיסית ותמיכה לחודש הראשון. עלויות נוספות כמו אחסון או שירותי צד שלישי מפורטות בנפרד.
            </p>
          </details>

          <details className="glass glass-hover p-6 rounded-xl group">
            <summary className="cursor-pointer text-lg font-semibold text-secondary flex items-center justify-between">
              האם אתה עובד עם לקוחות בחו"ל?
              <svg className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              כן, אני עובד עם לקוחות בישראל ובעולם. התקשורת מתבצעת באמצעות וידאו קונפרנס, ואני מתאים את שעות העבודה לאזור הזמן של הלקוח.
            </p>
          </details>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="container mx-auto py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary mb-4">בלוג</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            מאמרים, מדריכים ותובנות בתחומי AI, אוטומציה וטכנולוגיה
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/blog/getting-started-with-ai-automation">
            <Card className="glass glass-hover h-full cursor-pointer overflow-hidden">
              <div className="h-40 liquid-gradient flex items-center justify-center">
                <div className="text-5xl">💡</div>
              </div>
              <div className="p-6">
                <div className="text-xs text-primary font-medium mb-2">10 באוקטובר 2024</div>
                <h3 className="text-lg font-bold text-secondary mb-2">מתחילים עם אוטומציית AI</h3>
                <p className="text-sm text-muted-foreground">מדריך מקיף שיעזור לכם להתחיל לעבוד עם אוטומציית AI בעסק שלכם</p>
              </div>
            </Card>
          </Link>

          <Link href="/blog/n8n-vs-zapier">
            <Card className="glass glass-hover h-full cursor-pointer overflow-hidden">
              <div className="h-40 liquid-gradient flex items-center justify-center">
                <div className="text-5xl">⚡</div>
              </div>
              <div className="p-6">
                <div className="text-xs text-primary font-medium mb-2">5 באוקטובר 2024</div>
                <h3 className="text-lg font-bold text-secondary mb-2">n8n מול Zapier: מה לבחור?</h3>
                <p className="text-sm text-muted-foreground">השוואה מעשית בין שני כלי האוטומציה הפופולריים ביותר</p>
              </div>
            </Card>
          </Link>

          <Link href="/blog/ai-business-impact-2024">
            <Card className="glass glass-hover h-full cursor-pointer overflow-hidden">
              <div className="h-40 liquid-gradient flex items-center justify-center">
                <div className="text-5xl">🚀</div>
              </div>
              <div className="p-6">
                <div className="text-xs text-primary font-medium mb-2">1 באוקטובר 2024</div>
                <h3 className="text-lg font-bold text-secondary mb-2">איך AI משנה את העסקים ב-2024</h3>
                <p className="text-sm text-muted-foreground">סקירה של המגמות החמות ביותר בתחום ה-AI העסקי</p>
              </div>
            </Card>
          </Link>
        </div>

        <div className="text-center">
          <Link href="/blog">
            <Button variant="outline" className="glass glass-hover border-primary/30 text-secondary font-medium px-8 py-6 rounded-full">
              צפה בכל המאמרים
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary mb-4">צור קשר</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            מוזמנים ליצור קשר לשיחת ייעוץ ראשונית ללא התחייבות
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="glass glass-hover p-8">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">שם מלא *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 glass rounded-xl border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-secondary"
                  placeholder="הכנס את שמך המלא"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">אימייל *</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 glass rounded-xl border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-secondary"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">טלפון</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 glass rounded-xl border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-secondary"
                  placeholder="050-1234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">הודעה *</label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-4 py-3 glass rounded-xl border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-secondary resize-none"
                  placeholder="ספר לי על הפרויקט שלך..."
                />
              </div>

              <Button type="submit" className="liquid-button w-full h-12 rounded-xl text-white font-medium">
                שלח הודעה
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-primary/20 text-center">
              <p className="text-sm text-muted-foreground mb-2">או צור קשר ישירות:</p>
              <a href="mailto:ohadyair.ai@gmail.com" className="text-primary font-medium hover:underline">
                ohadyair.ai@gmail.com
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-dark mt-20">
        <div className="container mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Ohad Yair" className="w-10 h-10" />
                <span className="text-white font-bold text-lg">Ohad Yair</span>
              </div>
              <p className="text-white/80 text-sm">
                בונה מערכות AI ואוטומציה שמייצרות אימפקט עסקי
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">קישורים מהירים</h4>
              <div className="space-y-2">
                <a href="#home" className="block text-white/80 text-sm hover:text-white transition-colors">בית</a>
                <a href="#services" className="block text-white/80 text-sm hover:text-white transition-colors">שירותים</a>
                <a href="#projects" className="block text-white/80 text-sm hover:text-white transition-colors">פרויקטים</a>
                <a href="#blog" className="block text-white/80 text-sm hover:text-white transition-colors">בלוג</a>
                <a href="#contact" className="block text-white/80 text-sm hover:text-white transition-colors">צור קשר</a>
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-white font-semibold mb-4">רשתות חברתיות</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 glass-hover rounded-full flex items-center justify-center text-white hover:text-primary transition-colors">
                  LI
                </a>
                <a href="#" className="w-10 h-10 glass-hover rounded-full flex items-center justify-center text-white hover:text-primary transition-colors">
                  GH
                </a>
                <a href="#" className="w-10 h-10 glass-hover rounded-full flex items-center justify-center text-white hover:text-primary transition-colors">
                  TW
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20 text-center">
            <p className="text-white/60 text-sm">
              © 2024 Ohad Yair. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 glass-dark p-4 z-50 border-t border-white/20">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/90 text-sm">
              אנחנו משתמשים בעוגיות כדי לשפר את חוויית המשתמש. המשך גלישה מהווה הסכמה לשימוש בעוגיות.
            </p>
            <Button
              onClick={() => setShowCookieBanner(false)}
              className="liquid-button px-6 py-2 rounded-full text-white text-sm font-medium whitespace-nowrap"
            >
              הבנתי
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

