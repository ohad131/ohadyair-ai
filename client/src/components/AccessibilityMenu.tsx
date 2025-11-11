import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

type AccessibilityMenuProps = {
  buttonClassName?: string;
  label?: string;
  showLabel?: boolean;
};

export default function AccessibilityMenu({
  buttonClassName,
  label = "תפריט נגישות",
  showLabel = false,
}: AccessibilityMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [contrast, setContrast] = useState(false);
  const [lineHeight, setLineHeight] = useState(false);
  const [cursorSize, setCursorSize] = useState(false);
  const [linkHighlight, setLinkHighlight] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${fontSize}%`;
    
    if (contrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (lineHeight) {
      root.classList.add('increased-line-height');
    } else {
      root.classList.remove('increased-line-height');
    }
    
    if (cursorSize) {
      root.classList.add('large-cursor');
    } else {
      root.classList.remove('large-cursor');
    }
    
    if (linkHighlight) {
      root.classList.add('highlight-links');
    } else {
      root.classList.remove('highlight-links');
    }
  }, [fontSize, contrast, lineHeight, cursorSize, linkHighlight]);

  const resetAll = () => {
    setFontSize(100);
    setContrast(false);
    setLineHeight(false);
    setCursorSize(false);
    setLinkHighlight(false);
  };

  return (
    <>
      {/* Accessibility Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-primary/20 bg-background/70 px-4 py-2 text-sm font-medium text-secondary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 glass glass-hover",
          buttonClassName
        )}
        aria-label={label}
        title={label}
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
          </svg>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full border border-primary/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </span>
        {showLabel && (
          <span className="hidden text-sm font-semibold text-secondary transition-colors duration-300 group-hover:text-primary md:inline">
            {label}
          </span>
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 transition-transform duration-300 group-hover:scale-x-100"
        />
      </button>

      {/* Accessibility Menu Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="glass w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary">תפריט נגישות</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors text-secondary"
                aria-label="סגור"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Font Size */}
              <div className="glass p-4 rounded-xl">
                <label className="block text-sm font-medium text-secondary mb-3">
                  גודל טקסט: {fontSize}%
                </label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                    variant="outline"
                    size="sm"
                    className="flex-1 glass-hover border-primary/30"
                  >
                    הקטן
                  </Button>
                  <Button
                    onClick={() => setFontSize(100)}
                    variant="outline"
                    size="sm"
                    className="flex-1 glass-hover border-primary/30"
                  >
                    רגיל
                  </Button>
                  <Button
                    onClick={() => setFontSize(Math.min(150, fontSize + 10))}
                    variant="outline"
                    size="sm"
                    className="flex-1 glass-hover border-primary/30"
                  >
                    הגדל
                  </Button>
                </div>
              </div>

              {/* High Contrast */}
              <button
                onClick={() => setContrast(!contrast)}
                className={`w-full glass glass-hover p-4 rounded-xl text-right transition-all ${
                  contrast ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-secondary font-medium">ניגודיות גבוהה</span>
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      contrast ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                        contrast ? 'translate-x-1' : 'translate-x-6'
                      }`}
                    />
                  </div>
                </div>
              </button>

              {/* Line Height */}
              <button
                onClick={() => setLineHeight(!lineHeight)}
                className={`w-full glass glass-hover p-4 rounded-xl text-right transition-all ${
                  lineHeight ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-secondary font-medium">ריווח שורות מוגדל</span>
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      lineHeight ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                        lineHeight ? 'translate-x-1' : 'translate-x-6'
                      }`}
                    />
                  </div>
                </div>
              </button>

              {/* Large Cursor */}
              <button
                onClick={() => setCursorSize(!cursorSize)}
                className={`w-full glass glass-hover p-4 rounded-xl text-right transition-all ${
                  cursorSize ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-secondary font-medium">סמן עכבר מוגדל</span>
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      cursorSize ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                        cursorSize ? 'translate-x-1' : 'translate-x-6'
                      }`}
                    />
                  </div>
                </div>
              </button>

              {/* Link Highlight */}
              <button
                onClick={() => setLinkHighlight(!linkHighlight)}
                className={`w-full glass glass-hover p-4 rounded-xl text-right transition-all ${
                  linkHighlight ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-secondary font-medium">הדגשת קישורים</span>
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      linkHighlight ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                        linkHighlight ? 'translate-x-1' : 'translate-x-6'
                      }`}
                    />
                  </div>
                </div>
              </button>

              {/* Reset Button */}
              <Button
                onClick={resetAll}
                className="w-full liquid-button text-white"
              >
                איפוס הגדרות נגישות
              </Button>

              {/* Accessibility Statement */}
              <div className="glass p-4 rounded-xl text-sm text-muted-foreground">
                <p className="mb-2">
                  <strong className="text-secondary">הצהרת נגישות:</strong>
                </p>
                <p>
                  אתר זה נבנה בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

