import { useCallback, useEffect, useRef } from "react";

const SPLASH_KEY = "splashShown:v1";

export function SplashScreen() {
  const timeoutRef = useRef<number | null>(null);

  const hideSplash = useCallback(() => {
    if (typeof window === "undefined") return;
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    document.documentElement.classList.remove("show-splash");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    if (!window.sessionStorage.getItem(SPLASH_KEY)) {
      window.sessionStorage.setItem(SPLASH_KEY, "1");
      root.classList.add("show-splash");
      timeoutRef.current = window.setTimeout(() => {
        hideSplash();
      }, 5000);
    } else {
      root.classList.remove("show-splash");
    }

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      root.classList.remove("show-splash");
    };
  }, [hideSplash]);

  return (
    <div
      className="splash relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-primary/10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="splash-heading"
    >
      <button
        type="button"
        className="absolute top-6 right-6 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80 transition-colors hover:bg-primary/20"
        aria-label="Hide splash screen"
        onClick={hideSplash}
      >
        Skip
      </button>
      <div className="absolute inset-0 bg-white/60">
        <div className="splash-grid" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-32 animate-spin-slow bg-[conic-gradient(var(--tw-gradient-stops))] from-primary/20 via-blue-500/10 to-purple-500/20 blur-3xl" />
          <div className="absolute inset-0 rounded-full border border-primary/40 animate-pulse-slow" />
          <div className="absolute inset-4 rounded-full border border-primary/20 animate-ping-slow" />
        </div>
      </div>
      <div className="relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="px-5 py-2 rounded-full border border-primary/40 bg-primary/10 backdrop-blur-sm text-xs font-semibold tracking-[0.4em] uppercase text-primary/90 animate-fade-in-up">
          AI INNOVATION
        </div>
        <h1
          id="splash-heading"
          className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-500 animate-gradient"
        >
          Welcome to the era of AI
        </h1>
        <p className="text-base md:text-lg text-primary/80 max-w-xl animate-fade-in-delayed">
          Ohad Yair · Intelligent Automation &amp; AI Solutions
        </p>
        <div className="flex items-center gap-3 text-xs tracking-[0.3em] text-primary/70 animate-fade-in-delayed">
          <span className="h-px w-12 bg-primary/30" />
          <span>INITIALIZING EXPERIENCE</span>
          <span className="h-px w-12 bg-primary/30" />
        </div>
      </div>
    </div>
  );
}

