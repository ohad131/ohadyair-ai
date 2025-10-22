import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function AccessibilityStatement() {
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
          <h1 className="text-4xl font-bold text-secondary mb-8">הצהרת נגישות</h1>
          
          <div className="space-y-6 text-secondary leading-relaxed">
            <p className="text-sm text-muted-foreground">עדכון אחרון: {new Date().toLocaleDateString('he-IL')}</p>

            <section>
              <h2 className="text-2xl font-bold mb-4">1. מחויבות לנגישות</h2>
              <p>
                אוהד יאיר מחויב להנגשת האתר ולהבטחת שוויון זכויות לאנשים עם מוגבלות.
                אנו פועלים בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013,
                ולתקן הישראלי ת"י 5568 המבוסס על WCAG 2.1 ברמת AA.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. רמת הנגישות</h2>
              <p>
                האתר עומד ברמת נגישות AA בהתאם לתקן הבינלאומי WCAG 2.1 (Web Content Accessibility Guidelines).
                זה כולל התאמות למגוון מוגבלויות:
              </p>
              <ul className="list-disc list-inside space-y-2 mr-6 mt-3">
                <li><strong>מוגבלות ראייה:</strong> תמיכה בקוראי מסך, ניגודיות גבוהה, הגדלת טקסט</li>
                <li><strong>מוגבלות שמיעה:</strong> תוכן טקסטואלי מלא, ללא הסתמכות על אודיו</li>
                <li><strong>מוגבלות מוטורית:</strong> ניווט מקלדת מלא, אזורי לחיצה גדולים</li>
                <li><strong>מוגבלות קוגניטיבית:</strong> שפה פשוטה, מבנה ברור, עקביות בעיצוב</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. תכונות נגישות באתר</h2>
              <p className="mb-3">האתר כולל את תכונות הנגישות הבאות:</p>
              
              <div className="space-y-4 mr-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">תפריט נגישות</h3>
                  <p>תפריט נגישות מקיף הכולל:</p>
                  <ul className="list-disc list-inside space-y-1 mr-6 mt-2">
                    <li>שינוי גודל טקסט (100% - 150%)</li>
                    <li>שינוי ניגודיות (רגיל / גבוה / הפוך)</li>
                    <li>שינוי גובה שורה לקריאה נוחה</li>
                    <li>הגדלת סמן העכבר</li>
                    <li>הדגשת קישורים</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">ניווט מקלדת</h3>
                  <ul className="list-disc list-inside space-y-1 mr-6">
                    <li>קפיצה לתוכן הראשי (Skip to Content)</li>
                    <li>ניווט בין אלמנטים באמצעות Tab</li>
                    <li>סגירת חלונות עם Escape</li>
                    <li>אישור פעולות עם Enter</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">תמיכה בקוראי מסך</h3>
                  <ul className="list-disc list-inside space-y-1 mr-6">
                    <li>תגיות ARIA מלאות</li>
                    <li>תיאורי alt לכל התמונות</li>
                    <li>כותרות היררכיות (H1-H6)</li>
                    <li>תיוגי landmark לניווט</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">עיצוב נגיש</h3>
                  <ul className="list-disc list-inside space-y-1 mr-6">
                    <li>ניגודיות צבעים עומדת בתקן AA</li>
                    <li>גופנים קריאים ובגדלים מתאימים</li>
                    <li>אזורי לחיצה גדולים (מינימום 44x44 פיקסלים)</li>
                    <li>מרווחים נאותים בין אלמנטים</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. טכנולוגיות נגישות</h2>
              <p>האתר נבנה עם טכנולוגיות מודרניות התומכות בנגישות:</p>
              <ul className="list-disc list-inside space-y-2 mr-6 mt-3">
                <li>HTML5 סמנטי</li>
                <li>CSS3 עם תמיכה ב-media queries</li>
                <li>JavaScript נגיש (Progressive Enhancement)</li>
                <li>React 19 עם תמיכה ב-ARIA</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. דפדפנים וטכנולוגיות מסייעות נתמכות</h2>
              <p className="mb-3">האתר נבדק ותומך בטכנולוגיות הבאות:</p>
              
              <div className="space-y-3 mr-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">דפדפנים</h3>
                  <ul className="list-disc list-inside space-y-1 mr-6">
                    <li>Chrome (גרסאות אחרונות)</li>
                    <li>Firefox (גרסאות אחרונות)</li>
                    <li>Safari (גרסאות אחרונות)</li>
                    <li>Edge (גרסאות אחרונות)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">קוראי מסך</h3>
                  <ul className="list-disc list-inside space-y-1 mr-6">
                    <li>NVDA (Windows)</li>
                    <li>JAWS (Windows)</li>
                    <li>VoiceOver (Mac, iOS)</li>
                    <li>TalkBack (Android)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. מגבלות ידועות</h2>
              <p>
                למרות מאמצינו להנגיש את האתר במלואו, ייתכנו מגבלות טכניות או תכנים שטרם הונגשו במלואם:
              </p>
              <ul className="list-disc list-inside space-y-2 mr-6 mt-3">
                <li>תכנים חיצוניים (סרטונים, מפות) עשויים להיות תלויים בנגישות הספק החיצוני</li>
                <li>קבצים להורדה (PDF, Word) - אנו עובדים על הנגשתם</li>
                <li>אנימציות מורכבות - ניתן להשבית דרך תפריט הנגישות</li>
              </ul>
              <p className="mt-3">
                אנו עובדים באופן שוטף לשיפור הנגישות ולטיפול במגבלות אלה.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. תהליך הנגשה</h2>
              <p>
                האתר הונגש על ידי צוות פיתוח מקצועי בהתאם לתקן ישראלי 5568 ו-WCAG 2.1 ברמת AA.
                התהליך כלל:
              </p>
              <ul className="list-disc list-inside space-y-2 mr-6 mt-3">
                <li>ביקורת נגישות אוטומטית באמצעות כלים מקצועיים</li>
                <li>בדיקות ידניות עם קוראי מסך וניווט מקלדת</li>
                <li>תיקון ליקויים והתאמות לתקן</li>
                <li>בדיקות משתמשים עם מוגבלויות (User Testing)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. משוב ופניות נגישות</h2>
              <p>
                אנו מזמינים אותך לדווח על בעיות נגישות או להציע שיפורים. המשוב שלך חשוב לנו ויסייע בשיפור הנגישות.
              </p>
              <p className="mt-3 font-semibold">ניתן ליצור קשר בדרכים הבאות:</p>
              <ul className="list-none space-y-2 mt-3 mr-6">
                <li><strong>רכז נגישות:</strong> אוהד יאיר</li>
                <li><strong>אימייל:</strong> <a href="mailto:ohadyair.ai@gmail.com" className="text-primary hover:underline">ohadyair.ai@gmail.com</a></li>
                <li><strong>טלפון:</strong> <a href="tel:+972504003234" className="text-primary hover:underline">050-400-3234</a></li>
                <li><strong>WhatsApp:</strong> <a href="https://wa.me/972504003234" className="text-primary hover:underline">050-400-3234</a></li>
              </ul>
              <p className="mt-3">
                אנו מתחייבים לטפל בכל פנייה בתוך 5 ימי עסקים ולספק פתרון או הסבר מפורט.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. עדכונים ושיפורים</h2>
              <p>
                אנו ממשיכים לעבוד על שיפור הנגישות באופן שוטף. הצהרת נגישות זו מתעדכנת בהתאם לשינויים באתר ולמשוב שמתקבל.
              </p>
              <p className="mt-3">
                <strong>תאריך ביקורת נגישות אחרונה:</strong> {new Date().toLocaleDateString('he-IL')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. זכויות והגשת תלונה</h2>
              <p>
                אם נתקלת בבעיית נגישות שלא נפתרה לשביעות רצונך, ניתן לפנות לנציבות שוויון זכויות לאנשים עם מוגבלות:
              </p>
              <ul className="list-none space-y-2 mt-3 mr-6">
                <li><strong>אתר:</strong> <a href="https://www.gov.il/he/departments/molsa/disability_commissioner" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">נציבות שוויון זכויות</a></li>
                <li><strong>טלפון:</strong> 02-6752219</li>
                <li><strong>פקס:</strong> 02-6752130</li>
              </ul>
            </section>

            <section className="border-t border-primary/20 pt-6 mt-8">
              <p className="text-sm text-muted-foreground">
                הצהרת נגישות זו נכתבה בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013,
                ולתקן הישראלי ת"י 5568 המבוסס על WCAG 2.1 ברמת AA. אנו מחויבים לספק שירות נגיש ושוויוני לכל המשתמשים.
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

