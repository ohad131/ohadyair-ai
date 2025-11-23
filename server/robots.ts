const BASE_URL = "https://www.ohadyair.cloud";

const ROBOTS_RULES = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /admin",
  "Disallow: /api/",
  "",
  `Sitemap: ${BASE_URL}/sitemap.xml`,
];

export function generateRobotsTxt(): string {
  return ROBOTS_RULES.join("\n");
}

