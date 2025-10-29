import { useEffect } from "react";

const SPLASH_KEY = "splashShown:v1";
const CONSENT_KEY = "cookieConsentAt";
const TTL = 1000 * 60 * 60 * 24 * 30; // 30 days

export function acceptCookies() {
  try {
    localStorage.setItem(CONSENT_KEY, String(Date.now()));
  } catch {}
  const root = document.documentElement;
  root.classList.remove("show-cookie");
  document.cookie = `consent=1; Max-Age=${TTL / 1000}; Path=/; SameSite=Lax`;
}

export default function ClientBootstrap() {
  useEffect(() => {
    const root = document.documentElement;
    try {
      if (!sessionStorage.getItem(SPLASH_KEY)) {
        sessionStorage.setItem(SPLASH_KEY, "1");
        root.classList.add("show-splash");
        const t = setTimeout(() => {
          root.classList.remove("show-splash");
        }, 5000);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    try {
      const last = Number(localStorage.getItem(CONSENT_KEY) || 0);
      if (Date.now() - last > TTL) {
        root.classList.add("show-cookie");
      }
    } catch {}
  }, []);

  useEffect(() => {
    const vv = (window as any).visualViewport;
    if (!vv) return;
    const onResize = () => {
      const kbLikelyOpen = vv.height < window.innerHeight - 80;
      document.documentElement.classList.toggle("vk-open", kbLikelyOpen);
    };
    vv.addEventListener("resize", onResize);
    onResize();
    return () => vv.removeEventListener("resize", onResize);
  }, []);

  return null;
}


