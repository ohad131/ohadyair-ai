import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createContactSubmission,
  getAllBlogPosts,
  getBlogPostBySlug,
  incrementBlogPostViews,
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
  }),
});

export type AppRouter = typeof appRouter;

