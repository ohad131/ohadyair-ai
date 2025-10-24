import { useEffect, useState } from "react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

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
          <h1 className="font-inter text-3xl md:text-5xl lg:text-6xl font-black mb-4 splash-title tracking-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient drop-shadow-[0_0_30px_rgba(0,188,212,0.5)]">
              Welcome to the era of
            </span>
            <span className="block text-7xl md:text-9xl lg:text-10xl mt-2 font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 animate-gradient splash-ai drop-shadow-[0_0_60px_rgba(138,43,226,1)]">
              AI
            </span>
          </h1>
          <p className="text-base md:text-lg mt-4 animate-fade-in-delayed font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
            Ohad Yair - AI & Automation Solutions
          </p>
        </div>
      </div>
    </div>
  );
}

