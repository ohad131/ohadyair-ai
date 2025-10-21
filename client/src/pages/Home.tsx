import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[467px] h-[765px] right-[20%] top-[15%] opacity-25 bg-gradient-to-b from-[#2bffff]/25 to-[#2bffff]/0 blur-[40px] rotate-[25deg]" />
        <div className="absolute w-[406px] h-[783px] right-[25%] top-[10%] opacity-30 bg-gradient-to-b from-[#2bffff]/30 to-[#2bffff]/0 blur-[20px] rotate-[25deg]" />
        <div className="absolute w-[493px] h-[824px] right-[35%] top-[5%] opacity-25 bg-gradient-to-b from-[#2bffff]/25 to-[#2bffff]/0 blur-[40px] rotate-[25deg]" />
        <div className="absolute w-[643px] h-[895px] left-[30%] top-[10%] opacity-10 bg-gradient-to-br from-[#2bffff]/10 to-[#2bffff]/0 blur-[60px] rotate-[25deg]" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-20 py-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="w-[60px] h-[60px] bg-primary rounded-xl shadow-[0px_0px_0px_4px_rgba(0,191,111,0.30)] overflow-hidden flex items-center justify-center">
            <img src="/RoundLOGO.png" alt="Ohad Yair Logo" className="w-[34px] h-[34px]" />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-12 px-8 py-2 bg-white/5 rounded-[49px] border border-white/5 backdrop-blur-sm">
            <a href="#home" className="px-4 py-3 bg-[#253233] rounded-[99px] shadow-[0px_4px_6px_0px_rgba(0,14,15,0.15)] text-[#e5fff2] text-sm font-medium">
              בית
            </a>
            <a href="#services" className="text-[#a7bdbd] text-sm font-medium hover:text-white transition-colors">
              שירותים
            </a>
            <a href="#projects" className="text-[#a7bdbd] text-sm font-medium hover:text-white transition-colors">
              פרויקטים
            </a>
            <a href="#blog" className="text-[#a7bdbd] text-sm font-medium hover:text-white transition-colors">
              בלוג
            </a>
            <a href="#about" className="text-[#a7bdbd] text-sm font-medium hover:text-white transition-colors">
              אודות
            </a>
            <a href="#contact" className="text-[#a7bdbd] text-sm font-medium hover:text-white transition-colors">
              צור קשר
            </a>
          </div>

          {/* CTA Button */}
          <Button className="h-12 px-6 bg-gradient-to-br from-white/40 to-transparent rounded-[100px] shadow-[0px_0px_0px_1px_rgba(9,54,44,1.00)] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.20)] backdrop-blur-[6px] text-white text-sm font-medium hover:bg-white/50 transition-all">
            <span>התחל עכשיו</span>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="none">
              <path d="M13.33 10L8.33 5L6.67 6.67L10 10L6.67 13.33L8.33 15L13.33 10Z" fill="currentColor" />
            </svg>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative z-10 container mx-auto px-20 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Text */}
          <div className="space-y-8">
            <h1 className="text-[52px] font-semibold leading-tight">
              בונה מערכות AI ואוטומציה שמייצרות אימפקט עסקי
            </h1>
            <p className="text-lg text-[#cee0e0] font-medium">
              ממפה תהליכים, מחבר דאטה, ומצמיח ביצועים בעזרת AI—בדיוק איפה שזה משנה.
            </p>
            <div className="flex gap-4">
              <Button className="h-12 px-8 bg-[#00bf6f]/80 rounded-full shadow-[0px_4px_8px_-4px_rgba(52,63,52,0.60)] shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.25)] shadow-[inset_0px_0px_0px_1px_rgba(0,185,108,1.00)] text-white font-medium hover:bg-[#00bf6f] transition-all">
                <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="none">
                  <path d="M15.83 10.83L11.83 14.83C11.64 15.02 11.39 15.13 11.13 15.13C10.87 15.13 10.62 15.02 10.43 14.83C10.04 14.44 10.04 13.81 10.43 13.42L12.34 11.5H4.5C3.95 11.5 3.5 11.05 3.5 10.5C3.5 9.95 3.95 9.5 4.5 9.5H12.34L10.43 7.58C10.04 7.19 10.04 6.56 10.43 6.17C10.82 5.78 11.45 5.78 11.84 6.17L15.84 10.17C16.22 10.56 16.22 11.19 15.83 10.83Z" fill="currentColor" />
                </svg>
                דברו איתי
              </Button>
              <Button variant="outline" className="h-12 px-8 bg-transparent border-white/20 rounded-full text-white font-medium hover:bg-white/5 transition-all">
                צפה בעבודות
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <Card className="w-full h-[400px] bg-neutral-50 rounded-xl shadow-[0px_3px_6px_-1px_rgba(0,0,0,0.10)] shadow-[0px_0px_0px_2px_rgba(212,212,212,0.30)] shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.30)] overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center">
                <img src="/RoundLOGO.png" alt="Ohad Yair" className="w-48 h-48 object-contain" />
              </div>
              <div className="absolute bottom-8 right-8 left-8">
                <div className="p-6 bg-black/50 rounded-xl border border-white/20 backdrop-blur-sm">
                  <h3 className="text-white text-sm font-semibold mb-1">מומחיות בפיתוח AI ואוטומציה</h3>
                  <p className="text-white/60 text-xs">משלב חשיבה עסקית עם יכולות טכניות מתקדמות ליצירת פתרונות שמניבים תוצאות.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl">
          <div>
            <div className="text-4xl font-bold text-white mb-2">5+</div>
            <div className="text-sm text-[#a7bdbd]">פרויקטים מוצלחים</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">10+</div>
            <div className="text-sm text-[#a7bdbd]">לקוחות מרוצים</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-sm text-[#a7bdbd]">מחויבות לאיכות</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative z-10 container mx-auto px-20 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">שירותים</h2>
          <p className="text-lg text-[#cee0e0] max-w-2xl mx-auto">
            פתרונות מותאמים אישית שמשלבים AI, אוטומציה וטכנולוגיות מתקדמות
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service 1: Automations */}
          <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all group">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">אוטומציות</h3>
            <p className="text-[#a7bdbd] text-sm mb-4">
              בניית זרימות עבודה אוטומטיות עם n8n/Activepieces, חיבור API, וסקרייפינג מתקדם
            </p>
          </Card>

          {/* Service 2: Websites */}
          <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all group">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">אתרים</h3>
            <p className="text-[#a7bdbd] text-sm mb-4">
              פיתוח אתרים תדמיתיים, מהירים ומותאמי SEO עם טכנולוגיות מודרניות
            </p>
          </Card>

          {/* Service 3: AI for Business */}
          <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all group">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI לעסקים</h3>
            <p className="text-[#a7bdbd] text-sm mb-4">
              שילוב מודלי שפה, צ'אטבוטים חכמים, וכלי AI מותאמים לצרכים עסקיים
            </p>
          </Card>

          {/* Service 4: Investments & Trading */}
          <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all group">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">השקעות ומסחר</h3>
            <p className="text-[#a7bdbd] text-sm mb-4">
              ניתוח דאטה פיננסי, כלי החלטה מבוססי AI, ואסטרטגיות מסחר מתקדמות
            </p>
          </Card>

          {/* Service 5: Entrepreneurship */}
          <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all group">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">יזמות</h3>
            <p className="text-[#a7bdbd] text-sm mb-4">
              בניית MVP, ניסוי רעיונות, וליווי טכנולוגי לסטארטאפים ויזמים
            </p>
          </Card>

          {/* Service 6: Consulting */}
          <Card className="p-6 bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all group">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">ייעוץ טכנולוגי</h3>
            <p className="text-[#a7bdbd] text-sm mb-4">
              ייעוץ אסטרטגי לבחירת טכנולוגיות, אופטימיזציה של תהליכים, ושיפור ביצועים
            </p>
          </Card>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 container mx-auto px-20 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">פרויקטים נבחרים</h2>
          <p className="text-lg text-[#cee0e0] max-w-2xl mx-auto">
            דוגמאות לעבודות שביצעתי בתחומי AI, אוטומציה ופיתוח
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Project 1: Study Buddy */}
          <Card className="overflow-hidden bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all group">
            <div className="h-48 bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center">
              <div className="text-6xl">📚</div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-white mb-2">Study Buddy</h3>
              <p className="text-[#a7bdbd] mb-4">
                פלטפורמת למידה חכמה מבוססת AI שמסייעת לסטודנטים ללמוד ביעילות, עם תכונות של סיכום חומרים, יצירת שאלות תרגול, והמלצות מותאמות אישית.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">AI</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">Education</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">Web App</span>
              </div>
            </div>
          </Card>

          {/* Project 2: BuzzAI */}
          <Card className="overflow-hidden bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all group">
            <div className="h-48 bg-gradient-to-br from-secondary/30 to-primary/20 flex items-center justify-center">
              <div className="text-6xl">🤖</div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-white mb-2">BuzzAI</h3>
              <p className="text-[#a7bdbd] mb-4">
                כלי אוטומציה לניהול תוכן ברשתות חברתיות, כולל יצירת תוכן בעזרת AI, תזמון פרסומים, וניתוח ביצועים בזמן אמת.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">AI</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">Automation</span>
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">Social Media</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 container mx-auto px-20 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl font-bold text-white mb-6">אודות אוהד</h2>
            <div className="space-y-4 text-[#cee0e0]">
              <p>
                אני אוהד יאיר, סטודנט לכלכלה וניהול ופרקטי-הנדסאי מכטרוניקה. בעבר שירתתי כמעצב מכני ביחידה טכנולוגית בצה"ל, שם פיתחתי יכולות של פתרון בעיות מורכבות וחשיבה מערכתית.
              </p>
              <p>
                היום אני מתמחה בבניית מערכות AI ואוטומציה שמייצרות ערך עסקי אמיתי. אני משלב ידע עסקי עם כישורים טכניים מתקדמים כדי ליצור פתרונות שמתאימים בדיוק לצרכי הלקוח.
              </p>
              <p>
                כיזם AI, אני תמיד מחפש הזדמנויות חדשות ללמוד, לצמוח ולעזור לאחרים להצליח בעידן הדיגיטלי.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-primary mb-1">כלכלה וניהול</div>
                <div className="text-sm text-[#a7bdbd]">סטודנט</div>
              </div>
              <div className="p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-primary mb-1">מכטרוניקה</div>
                <div className="text-sm text-[#a7bdbd]">פרקטי-הנדסאי</div>
              </div>
              <div className="p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-primary mb-1">מעצב מכני</div>
                <div className="text-sm text-[#a7bdbd]">צה"ל (לשעבר)</div>
              </div>
              <div className="p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-primary mb-1">יזם AI</div>
                <div className="text-sm text-[#a7bdbd]">נוכחי</div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative w-full h-[500px] bg-gradient-to-br from-primary/20 to-secondary/10 rounded-xl overflow-hidden flex items-center justify-center">
              <img src="/RoundLOGO.png" alt="Ohad Yair" className="w-64 h-64 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 container mx-auto px-20 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">שאלות נפוצות</h2>
          <p className="text-lg text-[#cee0e0] max-w-2xl mx-auto">
            תשובות לשאלות שמרבים לשאול
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: "איך נראה תהליך העבודה?",
              a: "התהליך מתחיל בשיחת היכרות להבנת הצרכים, ממשיך בתכנון מפורט והצעת מחיר, ואז עובר לשלב הפיתוח עם עדכונים שוטפים. בסיום מתבצע מסירה מלאה עם הדרכה ותמיכה."
            },
            {
              q: "כמה זמן לוקח לפתח פרויקט?",
              a: "משך הזמן משתנה לפי היקף הפרויקט. פרויקט קטן יכול להסתיים תוך שבועיים, בעוד פרויקט מורכב יכול לקחת מספר חודשים. אני מספק הערכת זמן מדויקת לאחר שיחת ההיכרות."
            },
            {
              q: "האם יש תחזוקה לאחר המסירה?",
              a: "כן, אני מציע חבילות תחזוקה שונות שכוללות עדכונים, תיקוני באגים, ותמיכה טכנית. ניתן לבחור בחבילה המתאימה ביותר לצרכים שלך."
            },
            {
              q: "איך מטפלים בפרטיות ואבטחת מידע?",
              a: "אני מקפיד על סטנדרטים גבוהים של אבטחת מידע, כולל הצפנה, גיבויים קבועים, ועמידה בתקני GDPR. כל המידע מטופל בסודיות מוחלטת."
            },
            {
              q: "האם אפשר לראות דוגמאות נוספות?",
              a: "בהחלט! צור איתי קשר ואשמח להציג לך פרויקטים נוספים שביצעתי, כולל case studies מפורטים ותוצאות עסקיות."
            },
            {
              q: "מה כלול במחיר?",
              a: "המחיר כולל את כל שלבי הפיתוח, בדיקות איכות, מסירה מלאה, הדרכה בסיסית ותמיכה לחודש הראשון. עלויות נוספות כמו אחסון או שירותי צד שלישי מפורטות בנפרד."
            },
            {
              q: "האם אתה עובד עם לקוחות בחו\"ל?",
              a: "כן, אני עובד עם לקוחות בישראל ובעולם. התקשורת מתבצעת באמצעות וידאו קונפרנס, ואני מתאים את שעות העבודה לאזור הזמן של הלקוח."
            }
          ].map((item, index) => (
            <details key={index} className="group bg-card/50 border border-border/50 rounded-lg p-6 backdrop-blur-sm hover:bg-card/70 transition-all">
              <summary className="flex justify-between items-center cursor-pointer text-white font-semibold">
                <span>{item.q}</span>
                <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-[#a7bdbd]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Blog Preview Section */}
      <section id="blog" className="relative z-10 container mx-auto px-20 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">בלוג</h2>
          <p className="text-lg text-[#cee0e0] max-w-2xl mx-auto">
            מאמרים, מדריכים ותובנות בתחומי AI, אוטומציה וטכנולוגיה
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/blog/getting-started-with-ai-automation">
            <Card className="overflow-hidden bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all cursor-pointer group">
              <div className="h-48 bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center">
                <div className="text-5xl">🚀</div>
              </div>
              <div className="p-6">
                <div className="text-xs text-[#a7bdbd] mb-2">10 אוקטובר 2024</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                  מתחילים עם אוטומציית AI
                </h3>
                <p className="text-[#a7bdbd] text-sm">
                  מדריך מקיף למי שרוצה להתחיל לשלב אוטומציה ו-AI בעסק שלו
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/blog/n8n-vs-zapier">
            <Card className="overflow-hidden bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all cursor-pointer group">
              <div className="h-48 bg-gradient-to-br from-secondary/30 to-primary/20 flex items-center justify-center">
                <div className="text-5xl">⚡</div>
              </div>
              <div className="p-6">
                <div className="text-xs text-[#a7bdbd] mb-2">5 אוקטובר 2024</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                  n8n מול Zapier: מה לבחור?
                </h3>
                <p className="text-[#a7bdbd] text-sm">
                  השוואה מעמיקה בין שני כלי האוטומציה המובילים בשוק
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/blog/ai-business-impact">
            <Card className="overflow-hidden bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all cursor-pointer group">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center">
                <div className="text-5xl">💡</div>
              </div>
              <div className="p-6">
                <div className="text-xs text-[#a7bdbd] mb-2">1 אוקטובר 2024</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                  איך AI משנה את העסקים ב-2024
                </h3>
                <p className="text-[#a7bdbd] text-sm">
                  סקירה של המגמות החמות ביותר ב-AI ואיך הן משפיעות על העסקים
                </p>
              </div>
            </Card>
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link href="/blog">
            <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/5">
              צפה בכל המאמרים
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 container mx-auto px-20 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">צור קשר</h2>
          <p className="text-lg text-[#cee0e0] max-w-2xl mx-auto">
            מוזמנים ליצור קשר לשיחת ייעוץ ראשונית ללא התחייבות
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8 bg-card/50 border-border/50 backdrop-blur-sm">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  שם מלא
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-white placeholder-[#a7bdbd] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="הכנס את שמך המלא"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  אימייל
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-white placeholder-[#a7bdbd] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                  טלפון
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-white placeholder-[#a7bdbd] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="050-1234567"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  הודעה
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-white placeholder-[#a7bdbd] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="ספר לי על הפרויקט שלך..."
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all"
              >
                שלח הודעה
              </Button>
            </form>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-[#a7bdbd] mb-4">או צור קשר ישירות:</p>
            <div className="flex justify-center gap-6">
              <a href="mailto:ohadyair.ai@gmail.com" className="text-primary hover:text-primary/80 transition-colors">
                ohadyair.ai@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 mt-20">
        <div className="container mx-auto px-20 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <img src="/RoundLOGO.png" alt="Logo" className="w-6 h-6" />
                </div>
                <span className="text-white font-semibold text-lg">Ohad Yair</span>
              </div>
              <p className="text-[#a7bdbd] text-sm">
                בונה מערכות AI ואוטומציה שמייצרות אימפקט עסקי
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">קישורים מהירים</h3>
              <div className="space-y-2">
                <a href="#home" className="block text-[#a7bdbd] hover:text-white transition-colors text-sm">בית</a>
                <a href="#services" className="block text-[#a7bdbd] hover:text-white transition-colors text-sm">שירותים</a>
                <a href="#projects" className="block text-[#a7bdbd] hover:text-white transition-colors text-sm">פרויקטים</a>
                <a href="#blog" className="block text-[#a7bdbd] hover:text-white transition-colors text-sm">בלוג</a>
                <a href="#contact" className="block text-[#a7bdbd] hover:text-white transition-colors text-sm">צור קשר</a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">רשתות חברתיות</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-card/50 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-all">
                  <span className="text-[#a7bdbd]">LI</span>
                </a>
                <a href="#" className="w-10 h-10 bg-card/50 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-all">
                  <span className="text-[#a7bdbd]">GH</span>
                </a>
                <a href="#" className="w-10 h-10 bg-card/50 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-all">
                  <span className="text-[#a7bdbd]">TW</span>
                </a>
              </div>
              <p className="text-xs text-[#a7bdbd] mt-4">
                הקישורים יתעדכנו בקרוב
              </p>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 text-center">
            <p className="text-[#a7bdbd] text-sm">
              © 2024 Ohad Yair. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

