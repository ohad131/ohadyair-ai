import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type ParticleStyle = {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
};

export default function GlobalDecor() {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.getElementById("decor-root"));
  }, []);

  const particles = useMemo<ParticleStyle[]>(
    () =>
      Array.from({ length: 15 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      })),
    []
  );

  if (!container) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {particles.map((style, index) => (
        <div
          key={`particle-${index}`}
          className="absolute h-2 w-2 rounded-full bg-primary/30 animate-pulse-glow"
          style={style}
        />
      ))}

      <div className="absolute top-1/4 right-1/4 h-64 w-64 text-primary/10">
        <svg viewBox="0 0 200 200" className="h-full w-full animate-rotate-circuit">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="20" x2="100" y2="40" stroke="currentColor" strokeWidth="2" />
          <line x1="100" y1="160" x2="100" y2="180" stroke="currentColor" strokeWidth="2" />
          <line x1="20" y1="100" x2="40" y2="100" stroke="currentColor" strokeWidth="2" />
          <line x1="160" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan" />

      <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
      <div
        className="absolute bottom-1/4 right-1/3 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-pulse-glow"
        style={{ animationDelay: "1.5s" }}
      />
    </div>,
    container
  );
}
