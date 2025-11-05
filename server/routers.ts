import { COOKIE_NAME, NOT_ADMIN_ERR_MSG, ONE_YEAR_MS } from "@shared/const";
import { SUPPORTED_LANGUAGE_CODES } from "@shared/language";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import type { InsertBlogPost } from "../src/db/schema";
import {
  createContactSubmission,
  getAllContactSubmissions,
  setContactSubmissionReadStatus,
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
  createImageRecord,
  getImageRecord,
  listImageRecords,
  deleteImageRecord,
  getAllProjectsAdmin,
  updateProject,
  getIntegrationSecretValue,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { sdk } from "./_core/sdk";
import { TRPCError } from "@trpc/server";
import { verifyPassword } from "./_core/password";
import { invokeLLM } from "./_core/llm";

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

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1, "Message cannot be empty"),
});

const CHAT_HISTORY_LIMIT = 12;
const FORGE_API_KEY_SECRET_KEY = "forgeApiKey";
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
        } catch (error) {
          console.error("Failed to submit contact form:", error);
          throw new Error("Failed to submit contact form");
        }

        try {
          // Notify owner (best effort - do not block the response)
          await notifyOwner({
            title: "טופס יצירת קשר חדש",
            content: `שם: ${input.name}\nאימייל: ${input.email}\n${input.phone ? `טלפון: ${input.phone}\n` : ""}הודעה: ${input.message}`,
          });
        } catch (error) {
          console.error("Failed to send contact notification:", error);
        }

        return { success: true };
      }),

    list: adminProcedure.query(async () => {
      return await getAllContactSubmissions();
    }),

    markRead: adminProcedure
      .input(z.object({ id: z.number().int().positive(), isRead: z.boolean().optional() }))
      .mutation(async ({ input }) => {
        await setContactSubmissionReadStatus(input.id, input.isRead ?? true);
        return { success: true } as const;
      }),
  }),

  chat: router({
    converse: publicProcedure
      .input(
        z.object({
          sessionId: z.string().trim().min(1).max(128),
          language: languageEnum.default("he").optional(),
          messages: z.array(chatMessageSchema).min(1),
        })
      )
      .mutation(async ({ input }) => {
        const language = input.language ?? "he";

        const [blogPosts, aiToolsList, siteCopy, projects] = await Promise.all([
          getAllBlogPosts(),
          getAllAITools(),
          getSiteContentByLanguage(language),
          (async () => {
            const db = await import("./db");
            return await db.getAllProjects();
          })(),
        ]);

        const knowledge = {
          language,
          lastUpdated: new Date().toISOString(),
          siteCopy,
          aiTools: aiToolsList.map(tool => ({
            name: tool.name,
            url: tool.url,
            color: tool.color,
            isActive: tool.isActive,
          })),
          projects: projects.map(project => ({
            title: project.title,
            slug: project.slug,
            description: project.description,
            fullDescription: project.fullDescription,
            technologies: project.technologies,
            projectUrl: project.projectUrl,
            githubUrl: project.githubUrl,
            isFeatured: project.isFeatured,
            isPublished: project.isPublished,
          })),
          blogPosts: blogPosts.map(post => ({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author,
            publishedAt: post.publishedAt,
            isFeatured: post.isFeatured,
          })),
        };

        const knowledgeSnapshot = JSON.stringify(knowledge, null, 2);

        const systemPrompt = [
          "You are Ohad Intelligence Chat (OI Chat), the AI strategist for visitors of ohadyair.ai.",
          "Primary goals:",
          "1. Understand the visitor's business, industry, and AI ambitions.",
          "2. Use the verified website data to answer questions about services, success stories, and thought leadership.",
          "3. Suggest realistic AI initiatives and encourage clear next steps (book a consultation, share contact info, etc.).",
          "4. If information is missing, make reasonable suggestions and invite the visitor to continue the conversation with Ohad's team.",
          "Tone: insightful, confident, professional, friendly. Keep answers concise but actionable.",
          "The following JSON captures the latest website data you may rely on. Do not expose raw JSON; use it to craft natural answers.",
          knowledgeSnapshot,
        ].join("\n");

        const recentMessages = input.messages.slice(-CHAT_HISTORY_LIMIT);
        const llmMessages = [
          { role: "system" as const, content: systemPrompt },
          ...recentMessages.map(message => ({
            role: message.role,
            content: message.content,
          })),
        ];

        let apiKeyOverride: string | null = null;
        try {
          apiKeyOverride = await getIntegrationSecretValue(FORGE_API_KEY_SECRET_KEY);
        } catch (error) {
          console.error("[Chat] Failed to load Gemini API key from database", error);
        }

        let result;
        try {
          result = await invokeLLM(
            {
              messages: llmMessages,
              maxTokens: 1024,
            },
            { apiKey: apiKeyOverride ?? undefined }
          );
        } catch (error) {
          console.error("[Chat] Gemini call failed", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate a response. Please try again shortly.",
          });
        }

        const choice = result.choices[0];
        if (!choice?.message?.content) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Received an empty response from the assistant.",
          });
        }

        const assistantContent = Array.isArray(choice.message.content)
          ? choice.message.content
              .map(part => {
                if (typeof part === "string") {
                  return part;
                }
                if (part.type === "text") {
                  return part.text;
                }
                return "";
              })
              .filter(Boolean)
              .join("\n")
          : choice.message.content;

        return {
          sessionId: input.sessionId,
          message: assistantContent,
          finishReason: choice.finish_reason,
          usage: result.usage ?? null,
        };
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
          displayOrder: z.number().optional(),
          isPublished: z.boolean().optional(),
          isFeatured: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await import("./db");
        return await db.createProject(input);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          data: z
            .object({
              title: z.string().min(1).optional(),
              slug: z.string().min(1).optional(),
              description: z.string().min(1).optional(),
              fullDescription: z.string().optional(),
              coverImage: z.string().optional(),
              technologies: z.string().optional(),
              projectUrl: z.string().optional(),
              githubUrl: z.string().optional(),
              displayOrder: z.number().optional(),
              isPublished: z.boolean().optional(),
              isFeatured: z.boolean().optional(),
            })
            .refine(data => Object.keys(data).length > 0, {
              message: "At least one field must be provided for update.",
            }),
        })
      )
      .mutation(async ({ input }) => {
        await updateProject(input.id, input.data);
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

  images: router({
    upload: adminProcedure
      .input(
        z.object({
          fileName: z.string().min(1),
          mimeType: z.string().min(1),
          base64Data: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const { id } = await createImageRecord(input);
        return { id, url: `/api/images/${id}` } as const;
      }),
    list: adminProcedure.query(async () => {
      const items = await listImageRecords();
      return items.map(item => ({
        ...item,
        url: `/api/images/${item.id}`,
      }));
    }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteImageRecord(input.id);
        return { success: true } as const;
      }),
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const record = await getImageRecord(input.id);
        if (!record) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Image not found" });
        }
        return {
          id: record.id,
          fileName: record.fileName,
          mimeType: record.mimeType,
          url: `/api/images/${record.id}`,
        } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;

