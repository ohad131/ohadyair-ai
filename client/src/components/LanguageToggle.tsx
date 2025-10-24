import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const [language, setLanguage] = useState<"he" | "en">("he");

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem("language") as "he" | "en" | null;
    if (saved) {
      setLanguage(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === "he" ? "rtl" : "ltr";
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "he" ? "en" : "he";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "he" ? "rtl" : "ltr";
    
    // Reload page to apply language changes
    window.location.reload();
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-full glass glass-hover transition-all duration-300 hover:scale-110"
      aria-label={language === "he" ? "Switch to English" : "עבור לעברית"}
      title={language === "he" ? "English" : "עברית"}
    >
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-secondary">
          {language === "he" ? "EN" : "HE"}
        </span>
      </div>
    </button>
  );
}

