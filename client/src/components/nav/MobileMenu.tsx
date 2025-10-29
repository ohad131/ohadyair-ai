import { useNav } from "@/contexts/NavContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MobileMenu() {
  const { isOpen, close } = useNav();
  const { t } = useLanguage();

  const items = [
    { href: "home", label: t.home },
    { href: "services", label: t.services },
    { href: "about", label: t.about },
    { href: "projects", label: t.projects },
    { href: "faq", label: t.faq },
    { href: "blog", label: t.blog },
    { href: "contact", label: t.contact },
  ];
  return (
    <div id="mobile-menu" className={`fixed inset-0 z-[1100] ${isOpen ? "block" : "hidden"}`}>
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <nav className="absolute inset-y-0 right-0 w-80 max-w-[90vw] bg-white p-4 shadow-xl border-l border-primary/10 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-secondary">{t.navMenuLabel}</span>
          <button onClick={close} aria-label={t.backToHome} className="w-8 h-8 rounded-full hover:bg-primary/10">✕</button>
        </div>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={`#${item.href}`}
                onClick={close}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-secondary hover:bg-primary/10"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="pt-4 mt-4 border-t border-primary/20 space-y-2">
          <div className="flex items-center justify-between px-1 py-2">
            <span className="text-sm font-medium text-secondary">{t.language}</span>
            <LanguageToggle />
          </div>
          <div className="flex items-center justify-between px-1 py-2">
            <span className="text-sm font-medium text-secondary">{t.darkMode}</span>
            <DarkModeToggle />
          </div>
        </div>
        <Button asChild className="w-full liquid-button h-12 rounded-full text-white text-sm font-medium mt-4">
          <a href="#contact" onClick={close}>{t.startNow}</a>
        </Button>
      </nav>
    </div>
  );
}


