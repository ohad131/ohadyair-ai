import { Moon, Sun, RotateCcw } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function DarkModeToggle() {
  const { theme, toggleTheme, clearOverride, isAuto, switchable } = useTheme();

  if (!switchable || !toggleTheme) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
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
      {!isAuto && clearOverride && (
        <button
          onClick={clearOverride}
          className="p-2 rounded-full glass glass-hover border border-primary/20 transition-all duration-300 hover:scale-110"
          aria-label="חזרה למצב אוטומטי"
          title="חזרה למצב אוטומטי"
        >
          <RotateCcw className="w-4 h-4 text-primary" />
        </button>
      )}
    </div>
  );
}

