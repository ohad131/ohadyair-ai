import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import WhatsAppButton from "@/components/WhatsAppButton";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Twitter, Linkedin, Phone } from "lucide-react";
import AIToolsNetwork from "@/components/AIToolsNetwork";
import { trpc } from "@/lib/trpc";
import { SplashScreen } from "@/components/SplashScreen";

export default function Home() {
  const { data: tools = [] } = trpc.aiTools.list.useQuery();
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll animation observer
  useEffect(() => {
    // Immediately show hero section animations
    const heroSection = document.getElementById('home');
    if (heroSection) {
      const heroAnimated = heroSection.querySelectorAll(
        '.animate-fade-in-up, .animate-fade-in-left, .animate-fade-in-right, .animate-scale-in, .animate-bounce-in, .animate-slide-in-bottom'
      );
      heroAnimated.forEach((el) => el.classList.add('visible'));
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    // Observe all animated elements EXCEPT those in hero section
    const animatedElements = document.querySelectorAll(
      '.animate-fade-in-up, .animate-fade-in-left, .animate-fade-in-right, .animate-scale-in, .animate-bounce-in, .animate-slide-in-bottom'
    );

    animatedElements.forEach((el) => {
      // Skip hero section elements
      if (!heroSection?.contains(el)) {
        observer.observe(el);
      }
    });

    return () => {
      animatedElements.forEach((el) => {
        if (!heroSection?.contains(el)) {
          observer.unobserve(el);
        }
      });
    };
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "services", "projects", "about", "faq", "blog", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <SplashScreen />
      <div className="min-h-screen">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        דלג לתוכן הראשי
      </a>

      {/* Accessibility Menu */}
      <AccessibilityMenu />

      {/* Futuristic Background Animations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-pulse-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Rotating circuit patterns */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" className="animate-rotate-circuit">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#00bcd4" strokeWidth="2" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="#00bcd4" strokeWidth="1" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="#00bcd4" strokeWidth="1" />
            <line x1="100" y1="20" x2="100" y2="40" stroke="#00bcd4" strokeWidth="2" />
            <line x1="100" y1="160" x2="100" y2="180" stroke="#00bcd4" strokeWidth="2" />
            <line x1="20" y1="100" x2="40" y2="100" stroke="#00bcd4" strokeWidth="2" />
            <line x1="160" y1="100" x2="180" y2="100" stroke="#00bcd4" strokeWidth="2" />
          </svg>
        </div>

        {/* Scanning line */}
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan" />

        {/* Glowing orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <nav className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            {/* Logo with Animation */}
            <a href="#home" className="relative w-14 h-14 glass-hover rounded-full overflow-hidden flex items-center justify-center group">
              <img src="/logo-round.png" alt="Ohad Yair Logo" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              {/* Rotating ring animation */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-spin-slow" />
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse-glow" />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 glass px-6 py-2 rounded-full">
              {[
                { href: "home", label: "בית" },
                { href: "services", label: "שירותים" },
                { href: "projects", label: "פרויקטים" },
                { href: "about", label: "אודות" },
                { href: "faq", label: "שאלות נפוצות" },
                { href: "blog", label: "בלוג" },
                { href: "contact", label: "צור קשר" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={`#${item.href}`}
                  className={`nav-link px-3 py-2 text-sm font-medium transition-colors ${
                    activeSection === item.href ? "active" : "text-secondary hover:text-primary"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle - Desktop */}
              <div className="hidden md:block">
                <DarkModeToggle />
              </div>

              {/* CTA Button - Desktop */}
              <Button className="hidden md:flex liquid-button h-12 px-6 rounded-full text-white text-sm font-medium">
                התחל עכשיו
              </Button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden glass-hover p-2 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="תפריט ניווט"
              >
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 glass p-4 rounded-2xl space-y-2">
              {[
                { href: "home", label: "בית" },
                { href: "services", label: "שירותים" },
                { href: "projects", label: "פרויקטים" },
                { href: "about", label: "אודות" },
                { href: "faq", label: "שאלות נפוצות" },
                { href: "blog", label: "בלוג" },
                { href: "contact", label: "צור קשר" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={`#${item.href}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.href
                      ? "bg-primary text-white"
                      : "text-secondary hover:bg-primary/10"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 mt-4 border-t border-primary/20">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm font-medium text-secondary">מצב תצוגה</span>
                  <DarkModeToggle />
                </div>
              </div>
              <Button className="w-full liquid-button h-12 rounded-full text-white text-sm font-medium mt-4">
                התחל עכשיו
              </Button>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="relative z-10">
        {/* Hero Section */}
        <section id="home" className="container mx-auto py-8 md:py-12">
          {/* Hero Title and Subtitle - ABOVE animation */}
          <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary leading-tight px-4 animate-fade-in-up">
              בונה מערכות <span className="text-primary">AI</span> ואוטומציה שמייצרות אימפקט עסקי
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-medium px-4 max-w-3xl mx-auto animate-fade-in-up stagger-1">
              ממפה תהליכים, מחבר דאטה, ומצמיח ביצועים בעזרת AI—בדיוק איפה שזה משנה.
            </p>
            <div className="text-xl md:text-2xl font-bold text-primary mb-4 animate-fade-in-up stagger-2">
              מתמחה בשילוב הכלים המתקדמים ביותר
            </div>
            <p className="text-sm md:text-base text-muted-foreground font-medium animate-fade-in-up stagger-3">
              13+ פלטפורמות AI ואוטומציה בשליטה מלאה
            </p>
          </div>

          {/* Hero AI Tools Network - NO background, NO border */}
          <div className="w-full h-auto md:h-[320px] mb-8 animate-scale-in stagger-4">
            <AIToolsNetwork tools={tools} />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-5">
            <a href="#contact">
              <Button className="liquid-button h-12 md:h-14 px-6 md:px-8 rounded-full text-white font-medium text-sm md:text-base button-ripple">
                <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="none">
                  <path d="M15.83 10.83L11.83 14.83C11.64 15.02 11.39 15.13 11.13 15.13C10.87 15.13 10.62 15.02 10.43 14.83C10.04 14.44 10.04 13.81 10.43 13.42L12.34 11.5H4.5C3.95 11.5 3.5 11.05 3.5 10.5C3.5 9.95 3.95 9.5 4.5 9.5H12.34L10.43 7.58C10.04 7.19 10.04 6.56 10.43 6.17C10.82 5.78 11.45 5.78 11.84 6.17L15.84 10.17C16.22 10.56 16.22 11.19 15.83 10.83Z" fill="currentColor" />
                </svg>
                דברו איתי
              </Button>
            </a>
            <a href="#projects">
              <Button variant="outline" className="h-12 md:h-14 px-6 md:px-8 glass glass-hover border-primary/30 rounded-full text-secondary font-medium text-sm md:text-base">
                צפה בעבודות
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            <div className="glass glass-hover p-6 rounded-2xl text-center animate-bounce-in stagger-1 hover-glow">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">+5</div>
              <div className="text-sm text-secondary font-medium">פרויקטים מוצלחים</div>
            </div>
            <div className="glass glass-hover p-6 rounded-2xl text-center animate-bounce-in stagger-2 hover-glow">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">+10</div>
              <div className="text-sm text-secondary font-medium">לקוחות מרוצים</div>
            </div>
            <div className="glass glass-hover p-6 rounded-2xl text-center animate-bounce-in stagger-3 hover-glow">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-secondary font-medium">מחויבות לאיכות</div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="container mx-auto py-12 md:py-20">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 animate-fade-in-up">שירותים</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up stagger-1">
              פתרונות מותאמים אישית שמשלבים AI, אוטומציה וטכנולוגיות מתקדמות
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
                title: "אוטומציות",
                description: "בניית זרימות עבודה אוטומטיות עם n8n/Activepieces, חיבור API, וסקרייפינג מתקדם",
              },
              {
                iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
                title: "אתרים",
                description: "פיתוח אתרים תדמיתיים, מהירים ומותאמי SEO עם טכנולוגיות מודרניות",
              },
              {
                iconPath: "M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm7.5-1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM8 15h8v2H8v-2z",
                title: "AI לעסקים",
                description: "שילוב מודלי שפה, צ'אטבוטים חכמים, וכלי AI מותאמים לצרכים עסקיים",
              },
              {
                iconPath: "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z",
                title: "הרצאות והכשרות",
                description: "הרצאות מעוררות השראה והכשרות מעשיות ב-AI, אוטומציה וטכנולוגיות מתקדמות",
              },
              {
                iconPath: "M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z",
                title: "יזמות",
                description: "בניית MVP, ניסוי רעיונות, וליווי טכנולוגי לסטארטאפים ויזמים",
              },
              {
                iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
                title: "ייעוץ טכנולוגי",
                description: "ייעוץ אסטרטגי לבחירת טכנולוגיות, אופטימיזציה של תהליכים, ושיפור ביצועים",
              },
            ].map((service, index) => (
              <Card key={index} className={`glass glass-hover p-6 md:p-8 rounded-2xl group relative overflow-hidden animate-fade-in-up card-hover-effect stagger-${index + 1}`}>
                {/* Large monochrome SVG icon in background */}
                <div className="absolute top-4 left-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                  <svg className="w-32 h-32 md:w-40 md:h-40" viewBox="0 0 24 24" fill="currentColor">
                    <path d={service.iconPath} />
                  </svg>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-secondary mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="container mx-auto py-12 md:py-20">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 animate-fade-in-up">פרויקטים נבחרים</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up stagger-1">
              דוגמאות לעבודות שביצעתי בתחומי AI, אוטומציה ופיתוח
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Study Buddy */}
            <Card className="glass glass-hover overflow-hidden group animate-fade-in-left stagger-2 card-hover-effect">
              <div className="h-48 liquid-gradient flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                📚
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-secondary mb-3">Study Buddy</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  פלטפורמת למידה חכמה מבוססת AI שמסייעת לסטודנטים ללמוד ביעילות, עם תכונות של סיכום חומרים, יצירת שאלות תרגול, והמלצות מותאמות אישית.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 glass rounded-full text-xs font-medium text-primary">AI</span>
                  <span className="px-3 py-1 glass rounded-full text-xs font-medium text-primary">Education</span>
                  <span className="px-3 py-1 glass rounded-full text-xs font-medium text-primary">Web App</span>
                </div>
              </div>
            </Card>

            {/* BuzzAI */}
            <Card className="glass glass-hover overflow-hidden group animate-fade-in-right stagger-3 card-hover-effect">
              <div className="h-48 liquid-gradient flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                🤖
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-secondary mb-3">BuzzAI</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  כלי אוטומציה לניהול תוכן ברשתות חברתיות, כולל יצירת תוכן בעזרת AI, תזמון פרסומים, וניתוח ביצועים בזמן אמת.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 glass rounded-full text-xs font-medium text-primary">AI</span>
                  <span className="px-3 py-1 glass rounded-full text-xs font-medium text-primary">Automation</span>
                  <span className="px-3 py-1 glass rounded-full text-xs font-medium text-primary">Social Media</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="container mx-auto py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 animate-fade-in-left">אודות</h2>
              <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed animate-fade-in-left stagger-1">
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

              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { title: "כלכלה וניהול", subtitle: "סטודנט" },
                  { title: "מכטרוניקה", subtitle: "פרקטי-הנדסאי" },
                  { title: "מעצב מכני", subtitle: "צה\"ל (לשעבר)" },
                  { title: "יזם AI", subtitle: "נוכחי" },
                ].map((item, index) => (
                  <div key={index} className={`glass glass-hover p-4 rounded-xl animate-scale-in hover-glow stagger-${index + 2}`}>
                    <div className="text-primary font-bold text-sm mb-1">{item.title}</div>
                    <div className="text-muted-foreground text-xs">{item.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Card className="glass glass-hover w-full rounded-2xl overflow-hidden animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <img src="/ohad-professional.svg" alt="אוהד יאיר - מומחה AI ואוטומציה" className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105" />
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="container mx-auto py-12 md:py-20">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 animate-fade-in-up">שאלות נפוצות</h2>
            <p className="text-base md:text-lg text-muted-foreground animate-fade-in-up stagger-1">תשובות לשאלות שמרבים לשאול</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "איך נראה תהליך העבודה?",
                a: "התהליך מתחיל בשיחת היכרות להבנת הצרכים, ממשיך בתכנון מפורט והצעת מחיר, ואז עובר לשלב הפיתוח עם עדכונים שוטפים. בסיום מתבצע מסירה מלאה עם הדרכה ותמיכה.",
              },
              {
                q: "כמה זמן לוקח לפתח פרויקט?",
                a: "משך הזמן משתנה לפי היקף הפרויקט. פרויקט קטן יכול להסתיים תוך שבועיים, בעוד פרויקט מורכב יכול לקחת מספר חודשים. אני מספק הערכת זמן מדויקת לאחר שיחת ההיכרות.",
              },
              {
                q: "האם יש תחזוקה לאחר המסירה?",
                a: "כן, אני מציע חבילות תחזוקה שונות שכוללות עדכונים, תיקוני באגים, ותמיכה טכנית. ניתן לבחור בחבילה המתאימה ביותר לצרכים שלך.",
              },
              {
                q: "איך מטפלים בפרטיות ואבטחת מידע?",
                a: "אני מקפיד על סטנדרטים גבוהים של אבטחת מידע, כולל הצפנה, גיבויים קבועים, ועמידה בתקני GDPR. כל המידע מטופל בסודיות מוחלטת.",
              },
              {
                q: "האם אפשר לראות דוגמאות נוספות?",
                a: "בהחלט! צור איתי קשר ואשמח להציג לך פרויקטים נוספים שביצעתי, כולל case studies מפורטים ותוצאות עסקיות.",
              },
              {
                q: "מה כלול במחיר?",
                a: "המחיר כולל את כל שלבי הפיתוח, בדיקות איכות, מסירה מלאה, הדרכה בסיסית ותמיכה לחודש הראשון. עלויות נוספות כמו אחסון או שירותי צד שלישי מפורטות בנפרד.",
              },
              {
                q: "האם אתה עובד עם לקוחות בחו\"ל?",
                a: "כן, אני עובד עם לקוחות בישראל ובעולם. התקשורת מתבצעת באמצעות וידאו קונפרנס, ואני מתאים את שעות העבודה לאזור הזמן של הלקוח.",
              },
            ].map((faq, index) => (
              <details key={index} className={`glass glass-hover rounded-xl group animate-slide-in-bottom hover-glow stagger-${Math.min(index + 1, 6)}`}>
                <summary className="p-4 md:p-6 cursor-pointer text-base md:text-lg font-semibold text-secondary flex items-center justify-between">
                  <span>{faq.q}</span>
                  <svg className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 md:px-6 pb-4 md:pb-6 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="container mx-auto py-12 md:py-20">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 animate-fade-in-up">בלוג</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up stagger-1">
              מאמרים, מדריכים ותובנות בתחומי AI, אוטומציה וטכנולוגיה
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { image: "/blog-ai-business.jpg", title: "איך להתחיל עם AI בעסק שלך", date: "15 אוקטובר 2024" },
              { image: "/blog-ai-automation.jpg", title: "אוטומציה עם n8n - מדריך למתחילים", date: "10 אוקטובר 2024" },
              { image: "/blog-ai-future.jpg", title: "5 דרכים שAI יכול לשפר את העסק שלך", date: "5 אוקטובר 2024" },
            ].map((post, index) => (
              <Card key={index} className={`glass glass-hover overflow-hidden group cursor-pointer animate-scale-in card-hover-effect image-hover-zoom stagger-${index + 2}`}>
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs text-primary font-medium mb-2">{post.date}</div>
                  <h3 className="text-lg font-bold text-secondary mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <div className="text-primary text-sm font-medium hover:underline">קרא עוד ←</div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline" className="glass glass-hover border-primary/30 px-8 py-3 rounded-full text-secondary">
                צפה בכל המאמרים
              </Button>
            </Link>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="container mx-auto py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 animate-fade-in-up">צור קשר</h2>
              <p className="text-base md:text-lg text-muted-foreground mb-4 animate-fade-in-up stagger-1">
                מוזמנים ליצור קשר לשיחת ייעוץ ראשונית ללא התחייבות
              </p>
              <a href="tel:+972504003234" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-lg font-medium">
                <Phone className="w-5 h-5" />
                050-400-3234
              </a>
            </div>

            <Card className="glass glass-hover p-6 md:p-8 animate-scale-in stagger-2">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      שם מלא <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 glass rounded-xl border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-secondary"
                      placeholder="שם מלא"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      אימייל <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 glass rounded-xl border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-secondary"
                      placeholder="your@email.com"
                    />
                  </div>
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
                  <label className="block text-sm font-medium text-secondary mb-2">
                    הודעה <span className="text-primary">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-4 py-3 glass rounded-xl border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-secondary resize-none"
                    placeholder="ספר לי על הפרויקט שלך..."
                  />
                </div>

                <Button type="submit" className="w-full liquid-button h-14 rounded-full text-white font-medium text-base">
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
      </main>

      {/* Footer */}
      <footer className="glass-dark mt-12 md:mt-20">
        <div className="container mx-auto py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/RoundLOGO.png" alt="אוהד יאיר רחימי" className="w-12 h-12 rounded-full" />
                <span className="text-white font-bold text-lg">אוהד יאיר רחימי</span>
              </div>
              <p className="text-white/80 text-sm">
                בונה מערכות AI ואוטומציה שמייצרות אימפקט עסקי
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">קישורים מהירים</h4>
              <div className="space-y-2">
                {["בית", "שירותים", "פרויקטים", "בלוג", "צור קשר"].map((link, index) => (
                  <a key={index} href={`#${link.toLowerCase()}`} className="block text-white/80 text-sm hover:text-white transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">רשתות חברתיות</h4>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com/YairOhad15930"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 glass-hover rounded-full flex items-center justify-center text-white hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/אוהד-רחימי-4ba222385"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 glass-hover rounded-full flex items-center justify-center text-white hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/60 text-sm">© 2024 Ohad Yair. All rights reserved.</p>
              <div className="flex gap-4 text-xs">
                <Link href="/privacy-policy" className="text-white/60 hover:text-white transition-colors">
                  מדיניות פרטיות
                </Link>
                <Link href="/terms-of-service" className="text-white/60 hover:text-white transition-colors">
                  תקנון שימוש
                </Link>
                <Link href="/accessibility" className="text-white/60 hover:text-white transition-colors">
                  הצהרת נגישות
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50">
          <div className="glass-dark p-4 md:p-6 rounded-2xl">
            <p className="text-white text-sm mb-4">
              אנחנו משתמשים בעוגיות כדי לשפר את חוויית המשתמש. המשך גלישה מהווה הסכמה לשימוש בעוגיות.
            </p>
            <Button
              onClick={() => setShowCookieBanner(false)}
              className="w-full liquid-button rounded-full text-white text-sm"
            >
              הבנתי
            </Button>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
    </>
  );
}

