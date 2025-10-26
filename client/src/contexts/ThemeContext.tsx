import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  clearOverride?: () => void;
  switchable: boolean;
  isAuto: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

const THEME_OVERRIDE_KEY = "theme:override";
const LEGACY_THEME_KEY = "theme";
const AUTO_CHECK_INTERVAL_MS = 5 * 60 * 1000;

const isTheme = (value: unknown): value is Theme => value === "light" || value === "dark";

const readStoredOverride = (): Theme | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(THEME_OVERRIDE_KEY);
  if (isTheme(stored)) return stored;
  const legacy = localStorage.getItem(LEGACY_THEME_KEY);
  if (isTheme(legacy)) {
    localStorage.setItem(THEME_OVERRIDE_KEY, legacy);
    localStorage.removeItem(LEGACY_THEME_KEY);
    return legacy;
  }
  return null;
};

const getIsraelHour = (): number | null => {
  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Jerusalem",
    });
    const formatted = formatter.format(new Date());
    const hour = Number(formatted);
    return Number.isNaN(hour) ? null : hour;
  } catch {
    try {
      const localized = new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem" });
      return new Date(localized).getHours();
    } catch {
      return null;
    }
  }
};

const computeAutoTheme = (fallback: Theme): Theme => {
  const hour = getIsraelHour();
  if (hour === null) return fallback;
  return hour >= 19 || hour < 7 ? "dark" : "light";
};

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const initialOverride = useMemo(() => readStoredOverride(), []);
  const [override, setOverride] = useState<Theme | null>(initialOverride);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    const stored = readStoredOverride();
    if (stored) return stored;
    return computeAutoTheme(defaultTheme);
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!switchable) return;
    if (override) {
      localStorage.setItem(THEME_OVERRIDE_KEY, override);
    } else {
      localStorage.removeItem(THEME_OVERRIDE_KEY);
    }
  }, [override, switchable]);

  useEffect(() => {
    if (!switchable) return;
    if (override) return;

    const updateTheme = () => {
      setTheme(prev => {
        const next = computeAutoTheme(prev ?? defaultTheme);
        return next;
      });
    };

    updateTheme();
    const interval = window.setInterval(updateTheme, AUTO_CHECK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [switchable, override, defaultTheme]);

  useEffect(() => {
    if (!switchable) return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_OVERRIDE_KEY) return;
      const stored = readStoredOverride();
      setOverride(stored);
      if (stored) {
        setTheme(stored);
      } else {
        setTheme(prev => computeAutoTheme(prev ?? defaultTheme));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [switchable, defaultTheme]);

  const applyOverride = (value: Theme | null) => {
    if (!switchable) return;
    setOverride(value);
    if (value) {
      setTheme(value);
      localStorage.setItem(THEME_OVERRIDE_KEY, value);
    } else {
      localStorage.removeItem(THEME_OVERRIDE_KEY);
      setTheme(prev => computeAutoTheme(prev ?? defaultTheme));
    }
  };

  const toggleTheme = switchable
    ? () => {
        const next = theme === "light" ? "dark" : "light";
        applyOverride(next);
      }
    : undefined;

  const clearOverride = switchable ? () => applyOverride(null) : undefined;

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, clearOverride, switchable, isAuto: !override }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
