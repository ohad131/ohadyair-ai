import { useEffect, useState } from "react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 splash-screen">
      <div className="relative">
        {/* Animated circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-primary/20 animate-ping-slow"></div>
          <div className="absolute w-24 h-24 rounded-full border-4 border-primary/40 animate-ping-slower"></div>
          <div className="absolute w-16 h-16 rounded-full bg-primary/10 animate-pulse-slow"></div>
        </div>
        
        {/* Logo/Text */}
        <div className="relative z-10 text-center splash-content">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
            AI
          </h1>
          <p className="text-sm text-muted-foreground mt-2 animate-fade-in-delayed">
            Ohad Yair
          </p>
        </div>
      </div>
    </div>
  );
}

