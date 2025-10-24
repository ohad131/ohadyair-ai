import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if user has a preference
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme) {
      const dark = savedTheme === "dark";
      setIsDark(dark);
      document.documentElement.classList.toggle("dark", dark);
    } else {
      // Auto-detect based on Israel time (18:00-06:00 is dark)
      const israelTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });
      const hour = new Date(israelTime).getHours();
      const autoDark = hour >= 18 || hour < 6;
      setIsDark(autoDark);
      document.documentElement.classList.toggle("dark", autoDark);
    }
  }, []);

  const toggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full glass glass-hover border border-primary/20 transition-all duration-300 hover:scale-110"
      aria-label={isDark ? "מעבר למצב בהיר" : "מעבר למצב כהה"}
      title={isDark ? "מעבר למצב בהיר" : "מעבר למצב כהה"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-primary" />
      ) : (
        <Moon className="w-5 h-5 text-secondary" />
      )}
    </button>
  );
}

