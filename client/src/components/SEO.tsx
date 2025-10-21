import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({
  title = "Ohad Yair - בונה מערכות AI ואוטומציה",
  description = "ממפה תהליכים, מחבר דאטה, ומצמיח ביצועים בעזרת AI—בדיוק איפה שזה משנה. שירותי אוטומציה, פיתוח אתרים, AI לעסקים, השקעות ויזמות.",
  keywords = "AI, אוטומציה, בינה מלאכותית, n8n, פיתוח אתרים, צ'אטבוט, השקעות, מסחר, יזמות, MVP, אוהד יאיר",
  image = "/RoundLOGO.png",
  url = "https://ohadyair.ai",
  type = "website",
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Standard meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("author", "Ohad Yair");
    updateMetaTag("language", "Hebrew");

    // Open Graph tags
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", image, true);
    updateMetaTag("og:url", url, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:locale", "he_IL", true);

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);

    // Additional SEO tags
    updateMetaTag("robots", "index, follow");
    updateMetaTag("googlebot", "index, follow");
  }, [title, description, keywords, image, url, type]);

  return null;
}

