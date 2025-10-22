import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold text-secondary mb-8">תקנון שימוש באתר</h1>
          
          <div className="space-y-6 text-secondary leading-relaxed">
            <p className="text-sm text-muted-foreground">עדכון אחרון: {new Date().toLocaleDateString('he-IL')}</p>

            <section>
              <h2 className="text-2xl font-bold mb-4">1. כללי</h2>
              <p>
                ברוכים הבאים לאתר של אוהד יאיר ("האתר"). השימוש באתר כפוף לתנאי תקנון זה.
                על ידי גלישה באתר או שימוש בשירותים המוצעים בו, אתה מסכים לתנאים אלה במלואם.
                אם אינך מסכים לתנאים, אנא הימנע משימוש באתר.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. שירותי האתר</h2>
              <p>
                האתר מספק מידע על שירותי פיתוח AI, אוטומציה, בניית אתרים, ושירותים טכנולוגיים נוספים.
                השירותים המוצעים באתר כוללים:
              </p>
              <ul className="list-disc list-inside space-y-2 mr-6 mt-3">
                <li>פיתוח מערכות AI ואוטומציה</li>
                <li>בניית אתרים ואפליקציות</li>
                <li>ייעוץ טכנולוגי ועסקי</li>
                <li>פתרונות למסחר והשקעות</li>
                <li>ליווי יזמים ופיתוח MVP</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. זכויות יוצרים וקניין רוחני</h2>
              <p>
                כל התכנים באתר, לרבות טקסטים, תמונות, לוגואים, עיצובים, קוד, ומידע אחר, הם רכושו הבלעדי של אוהד יאיר
                ומוגנים על פי חוק זכויות יוצרים, התשס"ח-2007 וחוקי קניין רוחני אחרים.
              </p>
              <p className="mt-3">
                אסור להעתיק, לשכפל, להפיץ, למכור, או לעשות שימוש מסחרי בתכנים ללא אישור בכתב מראש.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. שימוש מותר</h2>
              <p className="mb-3">אתה רשאי להשתמש באתר למטרות הבאות בלבד:</p>
              <ul className="list-disc list-inside space-y-2 mr-6">
                <li>קבלת מידע על השירותים המוצעים</li>
                <li>יצירת קשר לצורך בירור או הזמנת שירותים</li>
                <li>קריאת תכנים בבלוג למטרות אינפורמטיביות</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. שימוש אסור</h2>
              <p className="mb-3">אסור לעשות שימוש באתר למטרות הבאות:</p>
              <ul className="list-disc list-inside space-y-2 mr-6">
                <li>פעילות בלתי חוקית או הפרת זכויות של אחרים</li>
                <li>שליחת תוכן פוגעני, מעליב, או בלתי הולם</li>
                <li>ניסיון לפגוע באתר, לרבות פריצה, וירוסים, או התקפות סייבר</li>
                <li>איסוף מידע על משתמשים אחרים ללא הסכמתם</li>
                <li>שימוש באתר לצורכי ספאם או שיווק לא רצוי</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. הגבלת אחריות</h2>
              <p>
                האתר והתכנים בו מסופקים "כמות שהם" (AS IS) ללא כל אחריות, מפורשת או משתמעת.
                אוהד יאיר לא יהיה אחראי לכל נזק ישיר, עקיף, תוצאתי, או מקרי הנובע משימוש באתר או מאי-יכולת להשתמש בו.
              </p>
              <p className="mt-3">
                אנו לא מתחייבים שהאתר יהיה זמין ללא הפרעות, נקי מטעויות, או מאובטח לחלוטין מפני וירוסים או תוכנות זדוניות.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. קישורים לאתרים חיצוניים</h2>
              <p>
                האתר עשוי להכיל קישורים לאתרים חיצוניים שאינם בשליטתנו. אנו לא אחראים לתוכן, מדיניות הפרטיות,
                או פעילות של אתרים אלה. השימוש בהם הוא על אחריותך הבלעדית.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. פרטיות ואבטחת מידע</h2>
              <p>
                השימוש באתר כפוף למדיניות הפרטיות שלנו. אנו מחויבים להגן על המידע האישי שלך בהתאם לחוק הגנת הפרטיות.
                לפרטים נוספים, עיין ב<Link href="/privacy-policy" className="text-primary hover:underline">מדיניות הפרטיות</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. שינויים בתקנון</h2>
              <p>
                אנו שומרים לעצמנו את הזכות לעדכן את התקנון מעת לעת. שינויים יפורסמו באתר עם תאריך עדכון חדש.
                המשך שימוש באתר לאחר פרסום השינויים מהווה הסכמה לתקנון המעודכן.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. הגנת הצרכן</h2>
              <p>
                בהתאם לחוק הגנת הצרכן, התשמ"א-1981, אנו מתחייבים:
              </p>
              <ul className="list-disc list-inside space-y-2 mr-6 mt-3">
                <li>לספק מידע מדויק ושקוף על השירותים</li>
                <li>לכבד את זכויות הצרכן לביטול עסקה (במקרים הרלוונטיים)</li>
                <li>לטפל בתלונות באופן מקצועי ובזמן סביר</li>
                <li>לפעול בתום לב ובהגינות מסחרית</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. סמכות שיפוט</h2>
              <p>
                תקנון זה כפוף לדיני מדינת ישראל. כל מחלוקת הנובעת מהשימוש באתר תידון בבתי המשפט המוסמכים בישראל בלבד.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. יצירת קשר</h2>
              <p>
                לשאלות, הבהרות או תלונות בנוגע לתקנון, ניתן ליצור קשר:
              </p>
              <ul className="list-none space-y-2 mt-3">
                <li><strong>אימייל:</strong> <a href="mailto:ohadyair.ai@gmail.com" className="text-primary hover:underline">ohadyair.ai@gmail.com</a></li>
                <li><strong>טלפון:</strong> <a href="tel:+972504003234" className="text-primary hover:underline">050-400-3234</a></li>
                <li><strong>WhatsApp:</strong> <a href="https://wa.me/972504003234" className="text-primary hover:underline">050-400-3234</a></li>
              </ul>
            </section>

            <section className="border-t border-primary/20 pt-6 mt-8">
              <p className="text-sm text-muted-foreground">
                תקנון זה נכתב בהתאם לדיני מדינת ישראל, לרבות חוק הגנת הצרכן, חוק זכויות יוצרים, וחוק הגנת הפרטיות.
                השימוש באתר מהווה הסכמה מלאה לתנאי תקנון זה.
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

