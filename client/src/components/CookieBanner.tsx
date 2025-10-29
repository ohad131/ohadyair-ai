import { acceptCookies } from "./ClientBootstrap";

export default function CookieBanner() {
  // Visibility controlled by root class 'show-cookie'
  return (
    <div className="cookie-banner fixed inset-x-0 bottom-0 z-[1900]">
      <div className="mx-auto max-w-3xl m-4 rounded-lg bg-white/90 backdrop-blur px-4 py-3 shadow-lg border border-primary/20 text-foreground">
        <p className="text-sm">
          אנו משתמשים בעוגיות לשיפור החוויה. המשך שימוש באתר מהווה הסכמה.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={acceptCookies}
            className="px-3 py-1.5 rounded-md bg-cyan-500 text-white text-sm hover:bg-cyan-600 transition"
          >
            מאשר/ת
          </button>
          <a href="/privacy-policy" className="text-sm underline">למידע נוסף</a>
        </div>
      </div>
    </div>
  );
}


