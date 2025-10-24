import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createContactSubmission,
  getAllContactSubmissions,
  getAllBlogPosts,
  getBlogPostBySlug,
  incrementBlogPostViews,
  createBlogPost,
  deleteBlogPost,
  getAllAITools,
  updateAITool,
  getSiteContent,
  setSiteContent,
  toggleBlogFeatured,
} from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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

    list: publicProcedure.query(async () => {
      return await getAllContactSubmissions();
    }),
  }),

  blog: router({
    list: publicProcedure.query(async () => {
      return await getAllBlogPosts();
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

    create: publicProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          excerpt: z.string().min(1),
          content: z.string().min(1),
          author: z.string().min(1),
          coverImage: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await createBlogPost(input);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteBlogPost(input.id);
      }),

    toggleFeatured: publicProcedure
      .input(z.object({ id: z.number(), isFeatured: z.boolean() }))
      .mutation(async ({ input }) => {
        return await toggleBlogFeatured(input.id, input.isFeatured);
      }),
  }),

  projects: router({
    list: publicProcedure.query(async () => {
      const db = await import("./db");
      return await db.getAllProjects();
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
    create: publicProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          description: z.string().min(1),
          fullDescription: z.string().optional(),
          coverImage: z.string().optional(),
          technologies: z.string().optional(),
          projectUrl: z.string().optional(),
          githubUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return await db.createProject(input);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return await db.deleteProject(input.id);
      }),
    toggleFeatured: publicProcedure
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

    update: publicProcedure
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
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        return await getSiteContent(input.key);
      }),

    set: publicProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(async ({ input }) => {
        return await setSiteContent(input.key, input.value);
      }),
  }),
});

export type AppRouter = typeof appRouter;

