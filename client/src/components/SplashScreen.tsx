import { useEffect, useState } from "react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/95 to-primary/10">
      <div className="absolute inset-0 opacity-60">
        <div className="splash-grid" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-32 bg-[conic-gradient(var(--tw-gradient-stops))] from-primary/20 via-blue-500/10 to-purple-500/20 blur-3xl animate-spin-slow" />
          <div className="absolute inset-0 rounded-full border border-primary/40 animate-pulse-slow" />
          <div className="absolute inset-4 rounded-full border border-primary/20 animate-ping-slow" />
        </div>
      </div>
      <div className="relative z-10 text-center px-6">
        <div className="inline-flex flex-col items-center gap-4">
          <div className="px-5 py-2 rounded-full border border-primary/40 bg-primary/10 backdrop-blur-sm text-xs font-semibold tracking-[0.4em] uppercase text-primary/90 animate-fade-in-up">
            AI INNOVATION
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-500 animate-gradient">
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
    </div>
  );
}

