const BASE_URL = "https://www.ohadyair.cloud";

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

type SitemapEntry = {
  url: string;
  lastModified: Date;
  changefreq?: ChangeFrequency;
  priority?: number;
};

type NextSitemap = SitemapEntry[];

const resolveDate = (value?: Date | string | null): Date => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const selectLatestDate = (entries: SitemapEntry[]): Date | undefined => {
  if (entries.length === 0) return undefined;
  return entries.reduce((latest, entry) => {
    return entry.lastModified.getTime() > latest.getTime() ? entry.lastModified : latest;
  }, entries[0].lastModified);
};

const buildStaticRoutes = (opts: {
  blogUpdatedAt?: Date;
  projectsUpdatedAt?: Date;
}): SitemapEntry[] => {
  const now = new Date();

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changefreq: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: opts.blogUpdatedAt ?? now,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: opts.projectsUpdatedAt ?? now,
      changefreq: "monthly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changefreq: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: now,
      changefreq: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/accessibility`,
      lastModified: now,
      changefreq: "yearly",
      priority: 0.4,
    },
  ];
};

const fetchBlogEntries = async (): Promise<SitemapEntry[]> => {
  try {
    const { getAllBlogPosts } = await import("../../server/db");
    const posts = await getAllBlogPosts();

    return posts.map(post => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: resolveDate(post.updatedAt ?? post.publishedAt),
      changefreq: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("[sitemap] Failed to load blog posts", error);
    return [];
  }
};

const fetchProjectEntries = async (): Promise<SitemapEntry[]> => {
  try {
    const { getAllProjects } = await import("../../server/db");
    const projects = await getAllProjects();

    return projects
      .filter(project => project.slug)
      .map(project => ({
        url: `${BASE_URL}/projects/${project.slug}`,
        lastModified: resolveDate(project.updatedAt ?? project.createdAt),
        changefreq: "monthly",
        priority: 0.65,
      }));
  } catch (error) {
    console.error("[sitemap] Failed to load projects", error);
    return [];
  }
};

export default async function sitemap(): Promise<NextSitemap> {
  const [blogEntries, projectEntries] = await Promise.all([fetchBlogEntries(), fetchProjectEntries()]);

  const staticRoutes = buildStaticRoutes({
    blogUpdatedAt: selectLatestDate(blogEntries),
    projectsUpdatedAt: selectLatestDate(projectEntries),
  });

  return [...staticRoutes, ...blogEntries, ...projectEntries];
}

