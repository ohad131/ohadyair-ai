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
        <div className="relative z-10 text-center splash-content px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 splash-title">
            <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
              Welcome to the era of
            </span>
            <span className="block text-6xl md:text-8xl lg:text-9xl mt-2 bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent animate-gradient splash-ai">
              AI
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mt-4 animate-fade-in-delayed font-medium">
            Ohad Yair - AI & Automation Solutions
          </p>
        </div>
      </div>
    </div>
  );
}

