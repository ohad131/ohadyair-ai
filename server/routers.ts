import { COOKIE_NAME, NOT_ADMIN_ERR_MSG, ONE_YEAR_MS } from "@shared/const";
import { SUPPORTED_LANGUAGE_CODES } from "@shared/language";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import type { InsertBlogPost, InsertProject } from "../src/db/schema";
import {
  createContactSubmission,
  getAllContactSubmissions,
  getAllBlogPosts,
  getAllBlogPostsAdmin,
  getBlogPostBySlug,
  incrementBlogPostViews,
  createBlogPost,
  deleteBlogPost,
  updateBlogPost,
  getAllAITools,
  updateAITool,
  getSiteContent,
  setSiteContent,
  getUserByEmail,
  getSiteContentByLanguage,
  getAllSiteContent,
  setSiteContentBatch,
  toggleBlogFeatured,
  upsertUser,
  getAllProjectsAdmin,
  updateProject,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { sdk } from "./_core/sdk";
import { TRPCError } from "@trpc/server";
import { verifyPassword } from "./_core/password";

const languageEnum = z.enum(SUPPORTED_LANGUAGE_CODES);

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(255, "Slug must be 255 characters or fewer")
  .regex(/^[a-z0-9-]+$/i, "Slug may only include letters, numbers, and hyphens.");

const blogPostBaseFields = {
  title: z.string().trim().min(1, "Title is required").max(500),
  slug: slugSchema,
  excerpt: z.string().trim().min(1, "Excerpt is required"),
  content: z.string().trim().min(1, "Content is required"),
  author: z.string().trim().min(1, "Author is required").max(255),
  coverImage: z.string().trim().max(500).optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  publishedAt: z.coerce.date().optional(),
  views: z.number().int().nonnegative().optional(),
} as const;

const blogPostCreateInput = z.object({
  title: blogPostBaseFields.title,
  slug: blogPostBaseFields.slug,
  excerpt: blogPostBaseFields.excerpt,
  content: blogPostBaseFields.content,
  author: blogPostBaseFields.author,
  coverImage: blogPostBaseFields.coverImage,
  isPublished: blogPostBaseFields.isPublished,
  isFeatured: blogPostBaseFields.isFeatured,
  publishedAt: blogPostBaseFields.publishedAt,
});

const blogPostUpdateInput = z
  .object(blogPostBaseFields)
  .partial()
  .refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update.",
  });

const projectBaseInput = {
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1).optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  fullDescription: z.string().optional(),
  coverImage: z.string().optional(),
  coverFileId: z.string().optional(),
  technologies: z.string().optional(),
  projectUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  displayOrder: z.number().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
} as const;

const projectCreateInput = z
  .object(projectBaseInput)
  .refine(data => Boolean(data.excerpt ?? data.description), {
    message: "Excerpt is required",
    path: ["excerpt"],
  });

const projectUpdateInput = z
  .object(projectBaseInput)
  .partial()
  .refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update.",
  });

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(8),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await getUserByEmail(input.email);
        if (!user || !user.passwordHash) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        }

        if (user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }

        const passwordMatches = verifyPassword(user.passwordHash, input.password);
        if (!passwordMatches) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        }

        const sessionToken = await sdk.createSessionToken(user.id, {
          name: user.name ?? user.email ?? "",
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        await upsertUser({
          id: user.id,
          lastSignedIn: new Date(),
          role: user.role,
          email: user.email,
          name: user.name,
          loginMethod: user.loginMethod,
        });

        return { success: true } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Invalid email address"),
          phone: z.string().optional(),
          message: z.string().min(10, "Message must be at least 10 characters"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Save to database
          await createContactSubmission({
            name: input.name,
            email: input.email,
            phone: input.phone || null,
            message: input.message,
          });

          // Notify owner
          await notifyOwner({
            title: "טופס יצירת קשר חדש",
            content: `שם: ${input.name}\nאימייל: ${input.email}\n${input.phone ? `טלפון: ${input.phone}\n` : ""}הודעה: ${input.message}`,
          });

          return { success: true };
        } catch (error) {
          console.error("Failed to submit contact form:", error);
          throw new Error("Failed to submit contact form");
        }
      }),

    list: adminProcedure.query(async () => {
      return await getAllContactSubmissions();
    }),
  }),

  blog: router({
    list: publicProcedure.query(async () => {
      return await getAllBlogPosts();
    }),

    adminList: adminProcedure.query(async () => {
      return await getAllBlogPostsAdmin();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await getBlogPostBySlug(input.slug);
        if (!post) {
          throw new Error("Post not found");
        }
        // Increment view count
        await incrementBlogPostViews(input.slug);
        return post;
      }),

    create: adminProcedure
      .input(blogPostCreateInput)
      .mutation(async ({ input }) => {
        const sanitizedCoverImage = input.coverImage?.trim();
        const created = await createBlogPost({
          title: input.title,
          slug: input.slug.toLowerCase(),
          excerpt: input.excerpt,
          content: input.content,
          author: input.author,
          coverImage: sanitizedCoverImage && sanitizedCoverImage.length > 0 ? sanitizedCoverImage : null,
          isPublished: input.isPublished ?? true,
          isFeatured: input.isFeatured ?? false,
          publishedAt: input.publishedAt,
        });

        if (!created) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create blog post" });
        }

        return created;
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          data: blogPostUpdateInput,
        })
      )
      .mutation(async ({ input }) => {
        const sanitizedData: Partial<InsertBlogPost> = {};
        const { data } = input;

        if (data.title !== undefined) sanitizedData.title = data.title;
        if (data.slug !== undefined) sanitizedData.slug = data.slug.toLowerCase();
        if (data.excerpt !== undefined) sanitizedData.excerpt = data.excerpt;
        if (data.content !== undefined) sanitizedData.content = data.content;
        if (data.author !== undefined) sanitizedData.author = data.author;
        if (data.coverImage !== undefined) {
          const trimmed = data.coverImage?.trim();
          sanitizedData.coverImage = trimmed && trimmed.length > 0 ? trimmed : null;
        }
        if (data.isPublished !== undefined) sanitizedData.isPublished = data.isPublished;
        if (data.isFeatured !== undefined) sanitizedData.isFeatured = data.isFeatured;
        if (data.publishedAt !== undefined) sanitizedData.publishedAt = data.publishedAt;
        if (data.views !== undefined) sanitizedData.views = data.views;

        const updated = await updateBlogPost(input.id, sanitizedData);

        if (!updated) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
        }

        return updated;
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        return await deleteBlogPost(input.id);
      }),

    toggleFeatured: adminProcedure
      .input(z.object({ id: z.number().int().positive(), isFeatured: z.boolean() }))
      .mutation(async ({ input }) => {
        return await toggleBlogFeatured(input.id, input.isFeatured);
      }),
  }),

  projects: router({
    list: publicProcedure.query(async () => {
      const db = await import("./db");
      return await db.getAllProjects();
    }),
    adminList: adminProcedure.query(async () => {
      return await getAllProjectsAdmin();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const db = await import("./db");
        const project = await db.getProjectBySlug(input.slug);
        if (!project) {
          throw new Error("Project not found");
        }
        return project;
      }),
    create: adminProcedure
      .input(projectCreateInput)
      .mutation(async ({ input }) => {
        const db = await import("./db");
        const payload: InsertProject = {
          title: input.title,
          slug: input.slug.toLowerCase(),
          excerpt: input.excerpt ?? input.description ?? null,
          content: input.content ?? input.fullDescription ?? null,
          coverImage: input.coverImage ?? null,
          coverFileId: input.coverFileId ?? null,
          technologies: input.technologies ?? null,
          projectUrl: input.projectUrl ?? null,
          githubUrl: input.githubUrl ?? null,
          displayOrder: input.displayOrder ?? 0,
          isPublished: input.isPublished ?? false,
          isFeatured: input.isFeatured ?? false,
        };
        return await db.createProject(payload);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          data: projectUpdateInput,
        })
      )
      .mutation(async ({ input }) => {
        const sanitized: Partial<InsertProject> = {};
        const data = input.data;

        if (data.title !== undefined) sanitized.title = data.title;
        if (data.slug !== undefined) sanitized.slug = data.slug.toLowerCase();
        if (data.excerpt !== undefined || data.description !== undefined) {
          sanitized.excerpt = data.excerpt ?? data.description ?? null;
        }
        if (data.content !== undefined || data.fullDescription !== undefined) {
          sanitized.content = data.content ?? data.fullDescription ?? null;
        }
        if (data.coverImage !== undefined) {
          sanitized.coverImage = data.coverImage ?? null;
        }
        if (data.coverFileId !== undefined) {
          sanitized.coverFileId = data.coverFileId ?? null;
        }
        if (data.technologies !== undefined) sanitized.technologies = data.technologies ?? null;
        if (data.projectUrl !== undefined) sanitized.projectUrl = data.projectUrl ?? null;
        if (data.githubUrl !== undefined) sanitized.githubUrl = data.githubUrl ?? null;
        if (data.displayOrder !== undefined) sanitized.displayOrder = data.displayOrder;
        if (data.isPublished !== undefined) sanitized.isPublished = data.isPublished;
        if (data.isFeatured !== undefined) sanitized.isFeatured = data.isFeatured;

        await updateProject(input.id, sanitized);
        return { success: true } as const;
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return await db.deleteProject(input.id);
      }),
    toggleFeatured: adminProcedure
      .input(z.object({ id: z.number(), isFeatured: z.boolean() }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return await db.toggleProjectFeatured(input.id, input.isFeatured);
      }),
  }),
  aiTools: router({
    list: publicProcedure
      .input(z.void().optional())
      .query(async () => {
        return await getAllAITools();
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          url: z.string().optional(),
          color: z.string().optional(),
          displayOrder: z.number().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateAITool(id, data);
      }),
  }),

  siteContent: router({
    get: publicProcedure
      .input(z.object({ key: z.string(), language: languageEnum }))
      .query(async ({ input }) => {
        return await getSiteContent(input.key, input.language);
      }),

    getByLanguage: publicProcedure
      .input(z.object({ language: languageEnum }))
      .query(async ({ input }) => {
        return await getSiteContentByLanguage(input.language);
      }),

    list: adminProcedure
      .input(z.object({ language: languageEnum.optional() }).optional())
      .query(async ({ input }) => {
        if (input?.language) {
          return await getSiteContentByLanguage(input.language);
        }
        return await getAllSiteContent();
      }),

    set: adminProcedure
      .input(z.object({ key: z.string(), language: languageEnum, value: z.string() }))
      .mutation(async ({ input }) => {
        return await setSiteContent(input.key, input.language, input.value);
      }),

    setMany: adminProcedure
      .input(
        z.object({
          language: languageEnum,
          entries: z.array(z.object({ key: z.string(), value: z.string() })),
        })
      )
      .mutation(async ({ input }) => {
        return await setSiteContentBatch(input.language, input.entries);
      }),
  }),

});

export type AppRouter = typeof appRouter;

