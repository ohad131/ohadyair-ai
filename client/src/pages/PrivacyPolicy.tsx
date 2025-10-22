import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-white/20">
        <nav className="container mx-auto py-4 flex items-center justify-between">
          <Link href="/">
            <div className="w-14 h-14 glass-hover rounded-xl overflow-hidden flex items-center justify-center glow-cyan cursor-pointer">
              <img src="/logo-round.png" alt="Ohad Yair Logo" className="w-full h-full object-contain p-2" />
            </div>
          </Link>
          <Link href="/" className="text-secondary hover:text-primary transition-colors text-sm font-medium">
            ← חזרה לדף הבית
          </Link>
        </nav>
      </header>

      {/* Content */}
      <div className="container mx-auto py-12 max-w-4xl">
        <div className="glass glass-hover p-8 md:p-12 rounded-2xl">
          <h1 className="text-4xl font-bold text-secondary mb-8">מדיניות פרטיות</h1>
          
          <div className="space-y-6 text-secondary leading-relaxed">
            <p className="text-sm text-muted-foreground">עדכון אחרון: {new Date().toLocaleDateString('he-IL')}</p>

            <section>
              <h2 className="text-2xl font-bold mb-4">1. כללי</h2>
              <p>
                מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים, ומגנים על המידע האישי שלך כאשר אתה משתמש באתר שלנו.
                אנו מחויבים להגן על פרטיותך ולפעול בהתאם לחוק הגנת הפרטיות, התשמ"א-1981 ותקנות הגנת הפרטיות (אבטחת מידע), התשע"ז-2017.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. איסוף מידע</h2>
              <p className="mb-3">אנו אוספים מידע בדרכים הבאות:</p>
              <ul className="list-disc list-inside space-y-2 mr-6">
                <li><strong>מידע שאתה מספק:</strong> שם, אימייל, מספר טלפון, והודעות שנשלחות דרך טופס יצירת הקשר.</li>
                <li><strong>מידע טכני:</strong> כתובת IP, סוג דפדפן, מערכת הפעלה, וזמני גלישה.</li>
                <li><strong>עוגיות (Cookies):</strong> אנו משתמשים בעוגיות לשיפור חוויית המשתמש ולניתוח תנועה באתר.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. שימוש במידע</h2>
              <p className="mb-3">אנו משתמשים במידע שנאסף למטרות הבאות:</p>
              <ul className="list-disc list-inside space-y-2 mr-6">
                <li>מענה לפניות ושאלות שנשלחו דרך טופס יצירת הקשר</li>
                <li>שיפור השירותים והתוכן באתר</li>
                <li>שליחת עדכונים ומידע שיווקי (רק אם נתת הסכמה מפורשת)</li>
                <li>ניתוח סטטיסטי של השימוש באתר</li>
                <li>עמידה בדרישות חוקיות ורגולטוריות</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. שיתוף מידע עם צדדים שלישיים</h2>
              <p>
                אנו לא נמכור, נשכיר או נשתף את המידע האישי שלך עם צדדים שלישיים, למעט במקרים הבאים:
              </p>
              <ul className="list-disc list-inside space-y-2 mr-6 mt-3">
                <li>כאשר נדרש על פי חוק או צו שיפוטי</li>
                <li>עם ספקי שירות שעוזרים לנו להפעיל את האתר (למשל, שירותי אחסון ואנליטיקה)</li>
                <li>כאשר קיבלנו את הסכמתך המפורשת</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. אבטחת מידע</h2>
              <p>
                אנו נוקטים באמצעי אבטחה סבירים כדי להגן על המידע האישי שלך מפני גישה לא מורשית, שימוש לרעה, או אובדן.
                זה כולל הצפנת נתונים, גיבויים קבועים, ושימוש בפרוטוקולי אבטחה מתקדמים.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. זכויותיך</h2>
              <p className="mb-3">בהתאם לחוק הגנת הפרטיות, יש לך את הזכויות הבאות:</p>
              <ul className="list-disc list-inside space-y-2 mr-6">
                <li><strong>זכות עיון:</strong> לעיין במידע האישי שלך המצוי אצלנו</li>
                <li><strong>זכות תיקון:</strong> לבקש תיקון מידע שגוי או לא מדויק</li>
                <li><strong>זכות מחיקה:</strong> לבקש מחיקת המידע האישי שלך</li>
                <li><strong>זכות התנגדות:</strong> להתנגד לעיבוד המידע שלך למטרות שיווק</li>
                <li><strong>זכות הסגת גבול:</strong> לבקש הפסקת שימוש במידע שלך</li>
              </ul>
              <p className="mt-3">
                לממש את זכויותיך, צור קשר בכתובת: <a href="mailto:ohadyair.ai@gmail.com" className="text-primary hover:underline">ohadyair.ai@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. עוגיות (Cookies)</h2>
              <p>
                אנו משתמשים בעוגיות לשיפור חוויית הגלישה שלך. עוגיות הן קבצי טקסט קטנים שנשמרים במחשב שלך.
                אתה יכול לנהל או למחוק עוגיות בהגדרות הדפדפן שלך. שים לב שחסימת עוגיות עלולה להשפיע על תפקוד האתר.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Google Analytics</h2>
              <p>
                אנו משתמשים ב-Google Analytics לניתוח תנועה באתר. Google Analytics אוסף מידע אנונימי על השימוש באתר,
                כולל דפים שבוקרו, זמן שהייה, ומקור התנועה. מידע זה עוזר לנו לשפר את האתר והשירותים שלנו.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. קישורים לאתרים חיצוניים</h2>
              <p>
                האתר שלנו עשוי להכיל קישורים לאתרים חיצוניים. אנו לא אחראים על מדיניות הפרטיות או התוכן של אתרים אלה.
                אנו ממליצים לקרוא את מדיניות הפרטיות של כל אתר שאתה מבקר בו.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. שינויים במדיניות הפרטיות</h2>
              <p>
                אנו שומרים לעצמנו את הזכות לעדכן את מדיניות הפרטיות מעת לעת. שינויים מהותיים יפורסמו באתר עם תאריך עדכון חדש.
                המשך שימוש באתר לאחר פרסום השינויים מהווה הסכמה למדיניות המעודכנת.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. יצירת קשר</h2>
              <p>
                לשאלות, בקשות או תלונות בנוגע למדיניות הפרטיות, ניתן ליצור קשר:
              </p>
              <ul className="list-none space-y-2 mt-3">
                <li><strong>אימייל:</strong> <a href="mailto:ohadyair.ai@gmail.com" className="text-primary hover:underline">ohadyair.ai@gmail.com</a></li>
                <li><strong>טלפון:</strong> <a href="tel:+972504003234" className="text-primary hover:underline">050-400-3234</a></li>
                <li><strong>WhatsApp:</strong> <a href="https://wa.me/972504003234" className="text-primary hover:underline">050-400-3234</a></li>
              </ul>
            </section>

            <section className="border-t border-primary/20 pt-6 mt-8">
              <p className="text-sm text-muted-foreground">
                מדיניות פרטיות זו נכתבה בהתאם לחוק הגנת הפרטיות, התשמ"א-1981, תקנות הגנת הפרטיות (אבטחת מידע), התשע"ז-2017,
                והתקנות האירופיות GDPR. אנו מחויבים להגן על פרטיותך ולפעול בשקיפות מלאה.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-primary/20">
            <Link href="/">
              <Button className="liquid-button px-8 py-3 rounded-full text-white">
                חזרה לדף הבית
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

