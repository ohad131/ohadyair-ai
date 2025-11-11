import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNav } from "@/contexts/NavContext";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import WhatsAppButton from "@/components/WhatsAppButton";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Twitter, Linkedin, Phone } from "lucide-react";
import AIToolsNetwork from "@/components/AIToolsNetwork";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function createEmptyContactForm() {
  return {
    name: "",
    email: "",
    phone: "",
    message: "",
  };
}

export default function Home() {
  const { t, language } = useLanguage();
  const isHebrew = language === "he";
  const centeredSectionClass = "flex flex-col items-center text-center";
  const cardBodyAlignmentClass = isHebrew ? "text-right" : "text-left";
  const readMoreArrow = `${t.blogReadMore} ${isHebrew ? "←" : "→"}`;
  const blogDateLocale = isHebrew ? "he-IL" : "en-US";
  const fallbackProjects = isHebrew
    ? [
        {
          title: "סטאדי באדי",
          description: "פלטפורמת למידה חכמה המונעת בינה מלאכותית שמסייעת לסטודנטים ללמוד ביעילות",
          tags: ["בינה מלאכותית", "חינוך"],
          icon: "📚",
        },
        {
          title: "BuzzAI",
          description: "כלי אוטומציה לניהול תכנים ברשתות חברתיות וחיסכון בזמן צוותי השיווק",
          tags: ["בינה מלאכותית", "אוטומציה"],
          icon: "🤖",
        },
      ]
    : [
        {
          title: "Study Buddy",
          description: "An AI-powered smart learning platform that helps students learn efficiently",
          tags: ["AI", "Education"],
          icon: "📚",
        },
        {
          title: "BuzzAI",
          description: "An automation tool for managing content on social networks",
          tags: ["AI", "Automation"],
          icon: "🤖",
        },
      ];
  const fallbackBlogPosts = isHebrew
    ? [
        { image: "/blog-ai-business.jpg", title: "איך להתחיל עם AI בעסק שלך", date: "15 אוקטובר 2024" },
        { image: "/blog-ai-automation.jpg", title: "אוטומציה עם n8n - מדריך למתחילים", date: "10 אוקטובר 2024" },
        { image: "/blog-ai-future.jpg", title: "5 דרכים שAI יכול לשפר את העסק שלך", date: "5 אוקטובר 2024" },
      ]
    : [
        { image: "/blog-ai-business.jpg", title: "How to Start Using AI in Your Business", date: "October 15, 2024" },
        { image: "/blog-ai-automation.jpg", title: "Automation with n8n – A Beginner's Guide", date: "October 10, 2024" },
        { image: "/blog-ai-future.jpg", title: "5 Ways AI Can Level Up Your Business", date: "October 5, 2024" },
      ];
  const { data: tools = [] } = trpc.aiTools.list.useQuery();
  const { data: blogPosts = [] } = trpc.blog.list.useQuery();
  const { data: projects = [] } = trpc.projects.list.useQuery();
  const { data: siteCopy } = trpc.siteContent.getByLanguage.useQuery({ language });
  const [contactFormState, setContactFormState] = useState(createEmptyContactForm);
  const [contactFeedback, setContactFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const contactSubmitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success(t.contactSuccess);
      setContactFormState(createEmptyContactForm());
      setContactFeedback({ type: "success", message: t.contactSuccess });
    },
    onError: error => {
      const message = error.message || t.contactError;
      toast.error(message);
      setContactFeedback({ type: "error", message });
    },
  });

  const parseTechList = (value?: string | null) => {
    if (!value) return [] as string[];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [] as string[];
    }
  };

  const resolveCopy = (key: string, fallback: string) => {
    const value = siteCopy?.[key];
    if (typeof value !== "string") return fallback;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  };

  const heroTitle = resolveCopy("heroTitle", t.heroTitle);
  const heroSubtitle = resolveCopy("heroSubtitle", t.heroSubtitle);
  const aboutP1 = resolveCopy("aboutP1", t.aboutP1);
  const aboutP2 = resolveCopy("aboutP2", t.aboutP2);
  const aboutP3 = resolveCopy("aboutP3", t.aboutP3);
  const aboutCard1Title = resolveCopy("aboutCard1Title", isHebrew ? "כלכלה וניהול" : "Economics & Management");
  const aboutCard1Subtitle = resolveCopy("aboutCard1Subtitle", isHebrew ? "סטודנט" : "Student");
  const aboutCard2Title = resolveCopy("aboutCard2Title", isHebrew ? "מכטרוניקה" : "Mechatronics");
  const aboutCard2Subtitle = resolveCopy("aboutCard2Subtitle", isHebrew ? "פרקטי-הנדסאי" : "Practical Engineer");
  const aboutCard3Title = resolveCopy("aboutCard3Title", isHebrew ? "מעצב מכני" : "Mechanical Designer");
  const aboutCard3Subtitle = resolveCopy("aboutCard3Subtitle", isHebrew ? "צה\"ל (לשעבר)" : "IDF (Former)");
  const aboutCard4Title = resolveCopy("aboutCard4Title", isHebrew ? "יזם AI" : "AI Entrepreneur");
  const aboutCard4Subtitle = resolveCopy("aboutCard4Subtitle", isHebrew ? "נוכחי" : "Current");
  const stat1Value = resolveCopy("stats1Value", "5+");
  const stat1Label = resolveCopy("stats1Label", t.statProjects);
  const stat2Value = resolveCopy("stats2Value", "10+");
  const stat2Label = resolveCopy("stats2Label", t.statClients);
  const stat3Value = resolveCopy("stats3Value", "100%");
  const stat3Label = resolveCopy("stats3Label", t.statQuality);

  const buzzaiTitle = resolveCopy("buzzaiTitle", t.buzzaiTitle);
  const buzzaiSubtitle = resolveCopy("buzzaiSubtitle", t.buzzaiSubtitle);
  const buzzaiDescription = resolveCopy("buzzaiDescription", t.buzzaiDescription);
  const buzzaiCtaPrimary = resolveCopy("buzzaiCtaPrimary", t.buzzaiCtaPrimary);
  const buzzaiCtaSecondary = resolveCopy("buzzaiCtaSecondary", t.buzzaiCtaSecondary);
  const buzzaiFeatures = [
    {
      icon: "✨",
      title: resolveCopy("buzzaiFeature1Title", t.buzzaiFeature1Title),
      description: resolveCopy("buzzaiFeature1Desc", t.buzzaiFeature1Desc),
    },
    {
      icon: "📢",
      title: resolveCopy("buzzaiFeature2Title", t.buzzaiFeature2Title),
      description: resolveCopy("buzzaiFeature2Desc", t.buzzaiFeature2Desc),
    },
    {
      icon: "📊",
      title: resolveCopy("buzzaiFeature3Title", t.buzzaiFeature3Title),
      description: resolveCopy("buzzaiFeature3Desc", t.buzzaiFeature3Desc),
    },
  ];
  const buzzaiMetrics = [
    {
      value: resolveCopy("buzzaiMetric1Value", t.buzzaiMetric1Value),
      label: resolveCopy("buzzaiMetric1Label", t.buzzaiMetric1Label),
    },
    {
      value: resolveCopy("buzzaiMetric2Value", t.buzzaiMetric2Value),
      label: resolveCopy("buzzaiMetric2Label", t.buzzaiMetric2Label),
    },
    {
      value: resolveCopy("buzzaiMetric3Value", t.buzzaiMetric3Value),
      label: resolveCopy("buzzaiMetric3Label", t.buzzaiMetric3Label),
    },
  ];

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactFeedback(null);

    const payload = {
      name: contactFormState.name.trim(),
      email: contactFormState.email.trim(),
      phone: contactFormState.phone.trim(),
      message: contactFormState.message.trim(),
    };

    if (!payload.name || !payload.email || payload.message.length < 10) {
      const message =
        payload.message.length < 10
          ? isHebrew
            ? "נא לכתוב הודעה מפורטת יותר (לפחות 10 תווים)."
            : "Please add a more detailed message (minimum 10 characters)."
          : isHebrew
            ? "נא למלא שם ואימייל תקינים."
            : "Please provide a valid name and email.";
      setContactFeedback({ type: "error", message });
      return;
    }

    try {
      await contactSubmitMutation.mutateAsync({
        name: payload.name,
        email: payload.email,
        phone: payload.phone || undefined,
        message: payload.message,
      });
    } catch {
      // Error handled via onError toast & feedback.
    }
  };
  
  const [activeSection, setActiveSection] = useState("home");
  const nav = useNav();

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
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
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

    animatedElements.forEach(el => {
      // Skip hero section elements
      if (!heroSection?.contains(el)) {
        observer.observe(el);
      }
    });

    return () => {
      animatedElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "services", "about", "projects", "buzzai", "faq", "blog", "contact"];
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
      
      <div className="min-h-screen">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        {t.skipToContent}
      </a>

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
                { href: "home", label: t.home },
                { href: "services", label: t.services },
                { href: "about", label: t.about },
                { href: "projects", label: t.projects },
                { href: "buzzai", label: t.buzzai },
                { href: "faq", label: t.faq },
                { href: "blog", label: t.blog },
                { href: "contact", label: t.contact },
              ].map(item => (
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
              {/* Language Toggle - Desktop */}
              <div className="hidden md:block">
                <LanguageToggle />
              </div>

              {/* Dark Mode Toggle - Desktop */}
              <div className="hidden md:block">
                <DarkModeToggle />
              </div>

              <AccessibilityMenu
                label={t.accessibilityMenuLabel}
                showLabel
                buttonClassName={cn(
                  "h-11 px-3 text-xs font-semibold text-secondary md:h-12 md:px-6 md:text-sm",
                  isHebrew ? "md:flex-row-reverse" : ""
                )}
              />

              {/* CTA Button - Desktop */}
              <Button
                asChild
                className="hidden md:inline-flex liquid-button h-12 px-6 rounded-full text-white text-sm font-medium"
              >
                <a href="#contact">{t.startNow}</a>
              </Button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden glass-hover p-2 rounded-lg"
                onClick={() => nav.toggle()}
                aria-label={t.navMenuLabel}
              >
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {nav.isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu is rendered globally via <MobileMenu /> */}
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="relative z-10">
        {/* Hero Section */}
        <section id="home" className="container mx-auto py-8 md:py-12">
          {/* Hero Title and Subtitle - ABOVE animation */}
          <div className={cn("space-y-4 md:space-y-6 mb-8 md:mb-12", centeredSectionClass)}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary leading-tight px-4 animate-fade-in-up">
              {heroTitle}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-medium px-4 max-w-3xl mx-auto animate-fade-in-up stagger-1">
              {heroSubtitle}
            </p>
            <div className="text-xl md:text-2xl font-bold text-primary mb-4 animate-fade-in-up stagger-2">
              {t.heroHighlight}
            </div>
            <p className="text-sm md:text-base text-muted-foreground font-medium animate-fade-in-up stagger-3">
              {t.heroPlatforms}
            </p>
          </div>

          {/* Hero AI Tools Network - NO background, NO border */}
          <div className="w-full h-auto md:h-[320px] mb-8 animate-scale-in stagger-4">
            <AIToolsNetwork tools={tools} />
          </div>

          {/* CTA Buttons */}
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-5 justify-center",
              centeredSectionClass
            )}
          >
            <a href="#contact">
              <Button className="liquid-button h-12 md:h-14 px-6 md:px-8 rounded-full text-white font-medium text-sm md:text-base button-ripple">
                <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="none">
                  <path d="M15.83 10.83L11.83 14.83C11.64 15.02 11.39 15.13 11.13 15.13C10.87 15.13 10.62 15.02 10.43 14.83C10.04 14.44 10.04 13.81 10.43 13.42L12.34 11.5H4.5C3.95 11.5 3.5 11.05 3.5 10.5C3.5 9.95 3.95 9.5 4.5 9.5H12.34L10.43 7.58C10.04 7.19 10.04 6.56 10.43 6.17C10.82 5.78 11.45 5.78 11.84 6.17L15.84 10.17C16.22 10.56 16.22 11.19 15.83 10.83Z" fill="currentColor" />
                </svg>
                {t.heroButton1}
              </Button>
            </a>
            <a href="#projects">
              <Button variant="outline" className="h-12 md:h-14 px-6 md:px-8 glass glass-hover border-primary/30 rounded-full text-secondary font-medium text-sm md:text-base">
                {t.heroButton2}
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            <div className="glass glass-hover p-6 rounded-2xl text-center animate-bounce-in stagger-1 hover-glow">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat1Value}</div>
              <div className="text-sm text-secondary font-medium">{stat1Label}</div>
            </div>
            <div className="glass glass-hover p-6 rounded-2xl text-center animate-bounce-in stagger-2 hover-glow">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat2Value}</div>
              <div className="text-sm text-secondary font-medium">{stat2Label}</div>
            </div>
            <div className="glass glass-hover p-6 rounded-2xl text-center animate-bounce-in stagger-3 hover-glow">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat3Value}</div>
              <div className="text-sm text-secondary font-medium">{stat3Label}</div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="container mx-auto py-12 md:py-20">
          <div className={cn("mb-12 md:mb-16", centeredSectionClass)}>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 animate-fade-in-up">{t.servicesTitle}</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up stagger-1">
              {t.servicesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
                title: resolveCopy("service1Title", t.service3Title),
                description: resolveCopy("service1Desc", t.service3Desc),
              },
              {
                iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
                title: resolveCopy("service2Title", t.service2Title),
                description: resolveCopy("service2Desc", t.service2Desc),
              },
              {
                iconPath: "M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm7.5-1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM8 15h8v2H8v-2z",
                title: resolveCopy("service3Title", t.service1Title),
                description: resolveCopy("service3Desc", t.service1Desc),
              },
              {
                iconPath: "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z",
                title: resolveCopy("service4Title", t.service4Title),
                description: resolveCopy("service4Desc", t.service4Desc),
              },
              {
                iconPath: "M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z",
                title: resolveCopy("service5Title", t.service5Title),
                description: resolveCopy("service5Desc", t.service5Desc),
              },
              {
                iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
                title: resolveCopy("service6Title", t.service6Title),
                description: resolveCopy("service6Desc", t.service6Desc),
              },
            ].map((service, index) => (
              <Card
                key={index}
                className={cn(
                  `glass glass-hover p-6 md:p-8 rounded-2xl group relative overflow-hidden animate-fade-in-up card-hover-effect stagger-${index + 1}`,
                  cardBodyAlignmentClass
                )}
              >
                {/* Large monochrome SVG icon in background */}
                <div className="absolute top-4 left-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                  <svg className="w-32 h-32 md:w-40 md:h-40" viewBox="0 0 24 24" fill="currentColor">
                    <path d={service.iconPath} />
                  </svg>
                </div>
                
                {/* Content */}
                <div className={cn("relative z-10", cardBodyAlignmentClass)}>
                  <h3 className="text-xl md:text-2xl font-bold text-secondary mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="about" className="container mx-auto py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className={cn("order-2 lg:order-1", cardBodyAlignmentClass)}>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 animate-fade-in-up">{t.aboutTitle}</h2>
              <div
                className={cn(
                  "space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed animate-fade-in-left stagger-1",
                  cardBodyAlignmentClass
                )}
              >
                <p>{aboutP1}</p>
                <p>{aboutP2}</p>
                <p>{aboutP3}</p>
              </div>

              <div className={cn("grid grid-cols-2 gap-4 mt-8", cardBodyAlignmentClass)}>
                {[
                  { title: aboutCard1Title, subtitle: aboutCard1Subtitle },
                  { title: aboutCard2Title, subtitle: aboutCard2Subtitle },
                  { title: aboutCard3Title, subtitle: aboutCard3Subtitle },
                  { title: aboutCard4Title, subtitle: aboutCard4Subtitle },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      `glass glass-hover p-4 rounded-xl animate-scale-in hover-glow stagger-${index + 2}`,
                      cardBodyAlignmentClass
                    )}
                  >
                    <div className="text-primary font-bold text-sm mb-1">{item.title}</div>
                    <div className="text-muted-foreground text-xs">{item.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
                <Card className="glass glass-hover w-full rounded-2xl overflow-hidden animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  <img src="/ohad-professional.svg" alt={isHebrew ? 'אוהד יאיר - מומחה AI ואוטומציה' : 'Ohad Yair - AI & Automation Expert'} className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105" />
                </Card>
            </div>
          </div>
        </section>
        <section id="projects" className="container mx-auto py-12 md:py-20">
          <div className={cn("mb-12 md:mb-16", centeredSectionClass)}>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 animate-fade-in-up">{t.projectsTitle}</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up stagger-1">
              {t.projectsSubtitle}
            </p>
          </div>

          <div className="space-y-8 max-w-5xl mx-auto">
            {projects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {projects.slice(0, 4).map((project: any, index: number) => (
                    <Card
                      key={project.id}
                      className={cn(
                        `glass glass-hover overflow-hidden group animate-fade-in-${index % 2 === 0 ? "left" : "right"} stagger-${index + 2} card-hover-effect`,
                        cardBodyAlignmentClass
                      )}
                    >
                      {project.coverImage ? (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="h-48 liquid-gradient flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                          🚀
                        </div>
                      )}
                      <div className={cn("p-6 md:p-8 flex flex-col h-full", cardBodyAlignmentClass)}>
                        <h3 className="text-2xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {project.description}
                        </p>
                        {parseTechList(project.technologies).length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {parseTechList(project.technologies).slice(0, 4).map((tech: string, i: number) => (
                              <span key={i} className="px-3 py-1 glass rounded-full text-xs font-medium text-primary">{tech}</span>
                            ))}
                          </div>
                        )}
                        <div className="mt-auto flex items-center justify-between">
                          <Link href={`/projects/${project.slug}`}>
                            <Button variant="outline" className="glass text-primary border-primary/30">
                              {t.projectsReadMore}
                            </Button>
                          </Link>
                          <span className="text-2xl text-primary">{isHebrew ? "←" : "→"}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-center">
                  <Link href="/projects">
                    <Button className="liquid-button px-8 py-3 rounded-full text-white">
                      {t.projectsViewAll}
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {fallbackProjects.map((project, index) => (
                  <Card
                    key={project.title}
                    className={cn(
                      `glass glass-hover overflow-hidden group animate-fade-in-${index % 2 === 0 ? "left" : "right"} stagger-${index + 2} card-hover-effect`,
                      cardBodyAlignmentClass
                    )}
                  >
                    <div className="h-48 liquid-gradient flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                      {project.icon}
                    </div>
                    <div className={cn("p-6 md:p-8", cardBodyAlignmentClass)}>
                      <h3 className="text-2xl font-bold text-secondary mb-3">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 glass rounded-full text-xs font-medium text-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="buzzai" className="container mx-auto py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-stretch">
            <div className={cn("space-y-6", cardBodyAlignmentClass)}>
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary shadow-[0_10px_35px_rgba(56,189,248,0.25)]",
                  isHebrew ? "flex-row-reverse" : ""
                )}
              >
                <span className="text-lg">🤖</span>
                <span>{t.buzzai}</span>
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary leading-tight animate-fade-in-up">
                {buzzaiTitle}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed animate-fade-in-up stagger-1">
                {buzzaiSubtitle}
              </p>
              <div className="space-y-4">
                {buzzaiFeatures.map((feature, index) => (
                  <div
                    key={feature.title}
                    className={cn(
                      `glass glass-hover flex items-start gap-4 rounded-2xl p-4 md:p-5 animate-fade-in-up stagger-${index + 2}`,
                      isHebrew ? "flex-row-reverse text-right" : "text-left"
                    )}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                      {feature.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-secondary">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className={cn(
                  "flex flex-wrap items-center gap-3 pt-2",
                  isHebrew ? "justify-end" : "justify-start"
                )}
              >
                <Button
                  asChild
                  className="liquid-button h-12 rounded-full px-6 text-white text-sm font-medium shadow-lg shadow-primary/30"
                >
                  <a href="#contact">{buzzaiCtaPrimary}</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="glass-hover h-12 rounded-full border-primary/40 px-6 text-sm font-medium text-primary"
                >
                  <a href="#projects">{buzzaiCtaSecondary}</a>
                </Button>
              </div>
            </div>
            <Card className="relative overflow-hidden rounded-3xl border border-primary/20 bg-background/80 p-6 md:p-8 shadow-[0_25px_60px_rgba(15,23,42,0.18)]">
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-amber-200/25"
                aria-hidden
              />
              <div className="relative flex h-full flex-col gap-6">
                <div
                  className={cn(
                    "rounded-2xl border border-primary/40 bg-background/80 p-5 backdrop-blur",
                    cardBodyAlignmentClass
                  )}
                >
                  <h3 className="text-base font-semibold text-primary uppercase tracking-[0.3em]">{t.buzzai}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{buzzaiDescription}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {buzzaiMetrics.map(metric => (
                    <div
                      key={metric.label}
                      className="glass rounded-2xl px-4 py-5 text-center shadow-sm"
                    >
                      <div className="text-2xl font-bold text-primary">{metric.value}</div>
                      <div className="mt-1 text-xs text-muted-foreground leading-snug">{metric.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto space-y-2 rounded-2xl border border-dashed border-primary/30 bg-background/70 p-5 shadow-inner">
                  {buzzaiFeatures.map(feature => (
                    <div
                      key={`${feature.title}-workflow`}
                      className={cn(
                        "flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3 text-xs font-medium text-secondary",
                        isHebrew ? "flex-row-reverse text-right" : ""
                      )}
                    >
                      <span className={cn("flex items-center gap-2", isHebrew ? "flex-row-reverse" : "")}> 
                        <span className="text-base">{feature.icon}</span>
                        <span>{feature.title}</span>
                      </span>
                      <span className="flex items-center gap-1 text-primary/70">
                        <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                        AI
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* About Section */}

        {/* FAQ Section */}
        <section id="faq" className="container mx-auto py-12 md:py-20">
          <div className={cn("mb-12 md:mb-16", centeredSectionClass)}>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 animate-fade-in-up">{t.faqTitle}</h2>
            <p className="text-base md:text-lg text-muted-foreground animate-fade-in-up stagger-1">{t.faqSubtitle}</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: t.faq1Q,
                a: t.faq1A,
              },
              {
                q: t.faq2Q,
                a: t.faq2A,
              },
              {
                q: t.faq3Q,
                a: t.faq3A,
              },
              {
                q: t.faq4Q,
                a: t.faq4A,
              },
              {
                q: t.faq5Q,
                a: t.faq5A,
              },
              {
                q: t.faq6Q,
                a: t.faq6A,
              },
              {
                q: t.faq7Q,
                a: t.faq7A,
              },
            ].map((faq, index) => (
              <details
                key={index}
                className={cn(
                  `glass glass-hover rounded-xl group animate-slide-in-bottom hover-glow stagger-${Math.min(index + 1, 6)}`,
                  cardBodyAlignmentClass
                )}
              >
                <summary
                  className={cn(
                    "p-4 md:p-6 cursor-pointer text-base md:text-lg font-semibold text-secondary flex items-center justify-between",
                    cardBodyAlignmentClass
                  )}
                >
                  <span>{faq.q}</span>
                  <svg className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className={cn("px-4 md:px-6 pb-4 md:pb-6 text-sm md:text-base text-muted-foreground leading-relaxed", cardBodyAlignmentClass)}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="container mx-auto py-12 md:py-20">
          <div className={cn("mb-12 md:mb-16", centeredSectionClass)}>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 animate-fade-in-up">{t.blogTitle}</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up stagger-1">
              {t.blogSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.length > 0 ? (
              blogPosts.slice(0, 3).map((post: any, index: number) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card
                    className={cn(
                      `glass glass-hover overflow-hidden group cursor-pointer animate-scale-in card-hover-effect image-hover-zoom stagger-${index + 2}`,
                      cardBodyAlignmentClass
                    )}
                  >
                    <div className="h-48 overflow-hidden">
                      {post.coverImage ? (
                        <img 
                          src={post.coverImage} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full liquid-gradient flex items-center justify-center text-4xl">
                          📝
                        </div>
                      )}
                    </div>
                    <div className={cn("p-6", cardBodyAlignmentClass)}>
                      <div className="text-xs text-primary font-medium mb-2">
                        {new Date(post.publishedAt).toLocaleDateString(blogDateLocale, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <h3 className="text-lg font-bold text-secondary mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                      <div className="text-primary text-sm font-medium hover:underline">{readMoreArrow}</div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              // Fallback to static blog posts if database is empty
              fallbackBlogPosts.map((post, index) => (
                <Card
                  key={`${post.title}-${post.date}`}
                  className={cn(
                    `glass glass-hover overflow-hidden group cursor-pointer animate-scale-in card-hover-effect image-hover-zoom stagger-${index + 2}`,
                    cardBodyAlignmentClass
                  )}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className={cn("p-6", cardBodyAlignmentClass)}>
                    <div className="text-xs text-primary font-medium mb-2">{post.date}</div>
                    <h3 className="text-lg font-bold text-secondary mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <div className="text-primary text-sm font-medium hover:underline">{readMoreArrow}</div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className={cn("mt-8", centeredSectionClass)}>
            <Link href="/blog">
              <Button variant="outline" className="glass glass-hover border-primary/30 px-8 py-3 rounded-full text-secondary">
                {t.blogViewAll}
              </Button>
            </Link>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="container mx-auto py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className={cn("mb-12 md:mb-16", centeredSectionClass)}>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 animate-fade-in-up">{t.contactTitle}</h2>
              <p className="text-base md:text-lg text-muted-foreground mb-4 animate-fade-in-up stagger-1">
                {t.contactSubtitle}
              </p>
              <a href="tel:+972504003234" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-lg font-medium">
                <Phone className="w-5 h-5" />
                050-400-3234
              </a>
            </div>

            <Card
              className={cn(
                "glass glass-hover p-6 md:p-8 animate-scale-in stagger-2",
                cardBodyAlignmentClass
              )}
            >
              <form className="space-y-6" onSubmit={handleContactSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      {t.contactName} <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactFormState.name}
                      onChange={event =>
                        setContactFormState(prev => ({ ...prev, name: event.target.value }))
                      }
                      className="w-full px-4 py-3 glass rounded-xl border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-secondary"
                      placeholder={t.contactName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      {t.contactEmail} <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={contactFormState.email}
                      onChange={event =>
                        setContactFormState(prev => ({ ...prev, email: event.target.value }))
                      }
                      className="w-full px-4 py-3 glass rounded-xl border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-secondary"
                      placeholder={t.contactEmailPlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">{t.contactPhone}</label>
                  <input
                    type="tel"
                    value={contactFormState.phone}
                    onChange={event =>
                      setContactFormState(prev => ({ ...prev, phone: event.target.value }))
                    }
                    className="w-full px-4 py-3 glass rounded-xl border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-secondary"
                    placeholder={t.contactPhonePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    {t.contactMessage} <span className="text-primary">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    minLength={10}
                    value={contactFormState.message}
                    onChange={event =>
                      setContactFormState(prev => ({ ...prev, message: event.target.value }))
                    }
                    className="w-full px-4 py-3 glass rounded-xl border border-primary/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-secondary resize-none"
                    placeholder={t.contactMessagePlaceholder}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={contactSubmitMutation.isPending}
                  className="w-full liquid-button h-14 rounded-full text-white font-medium text-base"
                >
                  {contactSubmitMutation.isPending
                    ? isHebrew
                      ? "שולח..."
                      : "Sending..."
                    : t.contactButton}
                </Button>
                <div aria-live="polite">
                  {contactFeedback && (
                    <p
                      className={cn(
                        "text-sm",
                        contactFeedback.type === "success" ? "text-emerald-500" : "text-destructive"
                      )}
                    >
                      {contactFeedback.message}
                    </p>
                  )}
                </div>
              </form>

              <div className={cn("mt-8 pt-8 border-t border-primary/20", cardBodyAlignmentClass)}>
                <p className="text-sm text-muted-foreground mb-2">{t.contactDirectPrompt}</p>
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
                <span className="text-white font-bold text-lg">Ohad Yair Rahimi</span>
              </div>
              <p className="text-white/80 text-sm">
                {t.footerAboutText}
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{t.footerQuickLinks}</h4>
              <div className="space-y-2">
                {[
                  { href: "home", label: t.home },
                  { href: "services", label: t.services },
                  { href: "projects", label: t.projects },
                  { href: "blog", label: t.blog },
                  { href: "contact", label: t.contact },
                ].map((item, index) => (
                  <a key={index} href={`#${item.href}`} className="block text-white/80 text-sm hover:text-white transition-colors">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div>              <h4 className="text-white font-semibold mb-4">{t.footerSocial}</h4>
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
              <p className="text-white/60 text-sm">© 2024 Ohad Yair. {t.footerRights}</p>
              <div className="flex gap-4 text-xs">
                <Link href="/privacy-policy" className="text-white/60 hover:text-white transition-colors">
                  {t.privacyPolicy}
                </Link>
                <Link href="/terms-of-service" className="text-white/60 hover:text-white transition-colors">
                  {t.termsOfService}
                </Link>
                <Link href="/accessibility" className="text-white/60 hover:text-white transition-colors">
                  {t.accessibilityStatement}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
    </>
  );
}

