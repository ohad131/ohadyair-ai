import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createHash } from "crypto";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { nanoid } from "nanoid";
import {
  attachFileToBlogPost,
  attachFileToProject,
  findFileByHash,
  getBlogPostById,
  getFileRecord,
  getProjectById,
  insertFileRecord,
  listFilesForBlogPost,
  listFilesForProject,
  listStoredFiles,
  setBlogPostCoverFile,
  setProjectCoverFile,
} from "../db";
import { requireAdmin } from "../middleware/auth";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
]);

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

type ParsedUpload = {
  filename: string;
  mimeType: string;
  buffer: Buffer;
  size: number;
};

function sanitizeFilename(name: string | undefined): string {
  if (!name) return "upload";
  const trimmed = name.replace(/[\r\n]+/g, "").trim();
  return trimmed.length > 0 ? trimmed : "upload";
}

function extractBoundary(contentType: string | undefined): string | null {
  if (!contentType) return null;
  const match = /boundary=([^;]+)/i.exec(contentType);
  return match ? match[1] ?? null : null;
}

function parseNumericId(value: string | undefined, entity: string): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new HttpError(400, `Invalid ${entity} id`);
  }
  return parsed;
}

function ensureAllowedMimeType(mimeType: string) {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new HttpError(400, "Unsupported file type");
  }
}

function respondWithError(res: express.Response, error: unknown, defaultMessage: string) {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  console.error(defaultMessage, error);
  res.status(500).json({ error: defaultMessage });
}

async function parseWithBusboy(req: express.Request): Promise<ParsedUpload> {
  const busboyModule = await import("busboy").catch(error => {
    if ((error as NodeJS.ErrnoException).code === "ERR_MODULE_NOT_FOUND") {
      return null;
    }
    throw error;
  });

  if (!busboyModule) {
    return parseMultipartFallback(req);
  }

  const BusboyCtor: any = (busboyModule as any).default ?? busboyModule;

  return await new Promise<ParsedUpload>((resolve, reject) => {
    let resolved = false;
    let rejected = false;
    const busboy = new BusboyCtor({
      headers: req.headers,
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    });

    busboy.on("file", (_fieldname: string, file: any, info: any) => {
      if (resolved || rejected) {
        file.resume();
        return;
      }
      if (_fieldname !== "file") {
        file.resume();
        return;
      }

      const chunks: Buffer[] = [];
      let size = 0;

      file.on("data", (chunk: Buffer) => {
        if (resolved || rejected) return;
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        size += buffer.length;
        chunks.push(buffer);
      });

      file.on("limit", () => {
        rejected = true;
        reject(new HttpError(413, "File too large"));
      });

      file.on("end", () => {
        if (resolved || rejected) return;
        resolved = true;
        resolve({
          filename: sanitizeFilename(info?.filename),
          mimeType: info?.mimeType ?? "application/octet-stream",
          buffer: Buffer.concat(chunks),
          size,
        });
      });
    });

    busboy.on("finish", () => {
      if (!resolved && !rejected) {
        reject(new HttpError(400, "No file provided"));
      }
    });

    busboy.on("error", (error: unknown) => {
      if (!resolved && !rejected) {
        reject(error instanceof Error ? error : new Error("Upload failed"));
      }
    });

    req.pipe(busboy);
  });
}

async function parseMultipartFallback(req: express.Request): Promise<ParsedUpload> {
  const boundary = extractBoundary(req.headers["content-type"]);
  if (!boundary) {
    throw new HttpError(400, "Invalid multipart payload");
  }

  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;
    if (total > MAX_FILE_SIZE_BYTES) {
      throw new HttpError(413, "File too large");
    }
    chunks.push(buffer);
  }

  const body = Buffer.concat(chunks);
  const boundaryMarker = `--${boundary}`;
  const segments = body.toString("latin1").split(boundaryMarker);

  for (const segment of segments) {
    const trimmed = segment.trim();
    if (!trimmed || trimmed === "--") continue;

    const headerEnd = trimmed.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;

    const headerSection = trimmed.slice(0, headerEnd);
    let dataSection = trimmed.slice(headerEnd + 4);
    if (dataSection.endsWith("\r\n")) {
      dataSection = dataSection.slice(0, -2);
    }

    const headers = headerSection.split("\r\n");
    const disposition = headers.find(header => header.toLowerCase().startsWith("content-disposition"));
    if (!disposition) continue;

    const nameMatch = /name="([^"]+)"/i.exec(disposition);
    if (!nameMatch || nameMatch[1] !== "file") continue;

    const filenameMatch = /filename="([^"]*)"/i.exec(disposition);
    const contentTypeHeader = headers.find(header => header.toLowerCase().startsWith("content-type"));
    const mimeType = contentTypeHeader?.split(":")[1]?.trim() ?? "application/octet-stream";

    const buffer = Buffer.from(dataSection, "latin1");
    const size = buffer.length;
    if (size > MAX_FILE_SIZE_BYTES) {
      throw new HttpError(413, "File too large");
    }

    return {
      filename: sanitizeFilename(filenameMatch?.[1]),
      mimeType,
      buffer,
      size,
    };
  }

  throw new HttpError(400, "No file provided");
}

async function parseMultipartUpload(req: express.Request): Promise<ParsedUpload> {
  const contentType = req.headers["content-type"] ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
    throw new HttpError(400, "Expected multipart/form-data content type");
  }

  return await parseWithBusboy(req);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.post("/api/admin/uploads", requireAdmin, async (req, res) => {
    try {
      const upload = await parseMultipartUpload(req);
      ensureAllowedMimeType(upload.mimeType);

      const sha256 = createHash("sha256").update(upload.buffer).digest("hex");
      const existing = await findFileByHash(sha256);
      if (existing) {
        res.status(200).json({
          id: existing.id,
          filename: existing.filename,
          mimeType: existing.mimeType,
          size: existing.size,
          sha256: existing.sha256,
        });
        return;
      }

      const id = nanoid(26);
      await insertFileRecord({
        id,
        filename: upload.filename,
        mimeType: upload.mimeType,
        size: upload.size,
        sha256,
        bytes: upload.buffer,
        uploadedBy: "admin",
      });

      res.status(201).json({
        id,
        filename: upload.filename,
        mimeType: upload.mimeType,
        size: upload.size,
        sha256,
      });
    } catch (error) {
      respondWithError(res, error, "Failed to upload file");
    }
  });

  app.get("/api/admin/files", requireAdmin, async (_req, res) => {
    try {
      const files = await listStoredFiles();
      res.json(
        files.map(file => ({
          id: file.id,
          filename: file.filename,
          mimeType: file.mimeType,
          size: file.size,
          sha256: file.sha256,
          uploadedBy: file.uploadedBy,
          createdAt: file.createdAt ? new Date(file.createdAt).toISOString() : null,
          url: `/api/files/${file.id}`,
        }))
      );
    } catch (error) {
      respondWithError(res, error, "Failed to load files");
    }
  });

  app.post("/api/admin/blog-posts/:id/files", requireAdmin, async (req, res) => {
    try {
      const blogPostId = parseNumericId(req.params.id, "blog post");
      const fileId = typeof req.body?.fileId === "string" ? req.body.fileId.trim() : "";
      if (!fileId) {
        throw new HttpError(400, "fileId is required");
      }

      const [file, post] = await Promise.all([
        getFileRecord(fileId),
        getBlogPostById(blogPostId),
      ]);

      if (!file) {
        throw new HttpError(404, "File not found");
      }
      if (!post) {
        throw new HttpError(404, "Blog post not found");
      }

      await attachFileToBlogPost(blogPostId, fileId);
      res.status(204).end();
    } catch (error) {
      respondWithError(res, error, "Failed to attach file to blog post");
    }
  });

  app.post("/api/admin/projects/:id/files", requireAdmin, async (req, res) => {
    try {
      const projectId = parseNumericId(req.params.id, "project");
      const fileId = typeof req.body?.fileId === "string" ? req.body.fileId.trim() : "";
      if (!fileId) {
        throw new HttpError(400, "fileId is required");
      }

      const [file, project] = await Promise.all([
        getFileRecord(fileId),
        getProjectById(projectId),
      ]);

      if (!file) {
        throw new HttpError(404, "File not found");
      }
      if (!project) {
        throw new HttpError(404, "Project not found");
      }

      await attachFileToProject(projectId, fileId);
      res.status(204).end();
    } catch (error) {
      respondWithError(res, error, "Failed to attach file to project");
    }
  });

  app.patch("/api/admin/blog-posts/:id/cover", requireAdmin, async (req, res) => {
    try {
      const blogPostId = parseNumericId(req.params.id, "blog post");
      const rawFileId = req.body?.fileId;
      const fileId =
        rawFileId === null || rawFileId === undefined
          ? null
          : typeof rawFileId === "string"
            ? rawFileId.trim()
            : undefined;

      if (fileId === undefined) {
        throw new HttpError(400, "fileId must be a string or null");
      }

      if (fileId) {
        const file = await getFileRecord(fileId);
        if (!file) {
          throw new HttpError(404, "File not found");
        }
      }

      const post = await getBlogPostById(blogPostId);
      if (!post) {
        throw new HttpError(404, "Blog post not found");
      }

      await setBlogPostCoverFile(blogPostId, fileId);
      res.status(204).end();
    } catch (error) {
      respondWithError(res, error, "Failed to update blog post cover");
    }
  });

  app.patch("/api/admin/projects/:id/cover", requireAdmin, async (req, res) => {
    try {
      const projectId = parseNumericId(req.params.id, "project");
      const rawFileId = req.body?.fileId;
      const fileId =
        rawFileId === null || rawFileId === undefined
          ? null
          : typeof rawFileId === "string"
            ? rawFileId.trim()
            : undefined;

      if (fileId === undefined) {
        throw new HttpError(400, "fileId must be a string or null");
      }

      if (fileId) {
        const file = await getFileRecord(fileId);
        if (!file) {
          throw new HttpError(404, "File not found");
        }
      }

      const project = await getProjectById(projectId);
      if (!project) {
        throw new HttpError(404, "Project not found");
      }

      await setProjectCoverFile(projectId, fileId);
      res.status(204).end();
    } catch (error) {
      respondWithError(res, error, "Failed to update project cover");
    }
  });

  app.get("/api/files/:id", async (req, res) => {
    try {
      const file = await getFileRecord(req.params.id ?? "");
      if (!file) {
        res.status(404).json({ error: "File not found" });
        return;
      }

      const data = Buffer.isBuffer(file.bytes) ? file.bytes : Buffer.from(file.bytes);
      const etag = file.sha256;

      if (req.headers["if-none-match"] === etag) {
        res.status(304).end();
        return;
      }

      res.setHeader("ETag", etag);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("Accept-Ranges", "bytes");

      const rangeHeader = req.headers.range;
      const size = data.length;

      if (rangeHeader && file.mimeType.startsWith("video/")) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
        if (!match) {
          res.status(416).setHeader("Content-Range", `bytes */${size}`).end();
          return;
        }

        let start = match[1] ? Number.parseInt(match[1]!, 10) : 0;
        let end = match[2] ? Number.parseInt(match[2]!, 10) : size - 1;

        if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || end >= size) {
          res.status(416).setHeader("Content-Range", `bytes */${size}`).end();
          return;
        }

        const chunk = data.subarray(start, end + 1);
        res.status(206);
        res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
        res.setHeader("Content-Length", chunk.length.toString());
        res.setHeader("Content-Type", file.mimeType);
        res.end(chunk);
        return;
      }

      res.setHeader("Content-Length", size.toString());
      res.setHeader("Content-Type", file.mimeType);
      res.status(200).end(data);
    } catch (error) {
      respondWithError(res, error, "Failed to load file");
    }
  });

  app.get("/api/blog-posts/:id/files", async (req, res) => {
    try {
      const blogPostId = parseNumericId(req.params.id, "blog post");
      const post = await getBlogPostById(blogPostId);
      if (!post) {
        res.status(404).json({ error: "Blog post not found" });
        return;
      }

      const files = await listFilesForBlogPost(blogPostId);
      res.json(
        files.map(file => ({
          id: file.id,
          filename: file.filename,
          mimeType: file.mimeType,
          size: file.size,
          sha256: file.sha256,
          url: `/api/files/${file.id}`,
        }))
      );
    } catch (error) {
      respondWithError(res, error, "Failed to load blog post files");
    }
  });

  app.get("/api/projects/:id/files", async (req, res) => {
    try {
      const projectId = parseNumericId(req.params.id, "project");
      const project = await getProjectById(projectId);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      const files = await listFilesForProject(projectId);
      res.json(
        files.map(file => ({
          id: file.id,
          filename: file.filename,
          mimeType: file.mimeType,
          size: file.size,
          sha256: file.sha256,
          url: `/api/files/${file.id}`,
        }))
      );
    } catch (error) {
      respondWithError(res, error, "Failed to load project files");
    }
  });
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
