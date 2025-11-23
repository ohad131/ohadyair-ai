import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getImageRecord, getVideoRecord } from "../db";
import { generateSitemapXml } from "../sitemap";
import { generateRobotsTxt } from "../robots";
const MAX_BODY_LIMIT = "200mb";

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

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: MAX_BODY_LIMIT }));
  app.use(express.urlencoded({ limit: MAX_BODY_LIMIT, extended: true }));

  app.get("/api/images/:id", async (req, res) => {
    const id = Number.parseInt(req.params.id ?? "", 10);
    if (!Number.isFinite(id) || id <= 0) {
      res.status(400).send("Invalid image id");
      return;
    }

    try {
      const record = await getImageRecord(id);
      if (!record) {
        res.status(404).send("Image not found");
        return;
      }

      const buffer = Buffer.from(record.data, "base64");
      res.setHeader("Content-Type", record.mimeType);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.send(buffer);
    } catch (error) {
      console.error("[Images] Failed to serve image", error);
      res.status(500).send("Failed to load image");
    }
  });
  app.get("/api/videos/:id", async (req, res) => {
    const id = Number.parseInt(req.params.id ?? "", 10);
    if (!Number.isFinite(id) || id <= 0) {
      res.status(400).send("Invalid video id");
      return;
    }

    try {
      const record = await getVideoRecord(id);
      if (!record) {
        res.status(404).send("Video not found");
        return;
      }

      const buffer = Buffer.from(record.data, "base64");
      const totalLength = buffer.length;
      res.setHeader("Accept-Ranges", "bytes");

      const range = req.headers.range;
      if (range) {
        const match = /bytes=(\d+)-(\d*)/.exec(range);
        if (!match) {
          res.status(416).setHeader("Content-Range", `bytes */${totalLength}`).end();
          return;
        }

        const start = Number.parseInt(match[1] ?? "0", 10);
        const requestedEnd = match[2] ? Number.parseInt(match[2], 10) : totalLength - 1;
        const end = Math.min(requestedEnd, totalLength - 1);

        if (start >= totalLength || start > end) {
          res.status(416).setHeader("Content-Range", `bytes */${totalLength}`).end();
          return;
        }

        const chunk = buffer.subarray(start, end + 1);
        res.status(206);
        res.setHeader("Content-Range", `bytes ${start}-${end}/${totalLength}`);
        res.setHeader("Content-Length", chunk.length);
        res.setHeader("Content-Type", record.mimeType);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.send(chunk);
        return;
      }

      res.setHeader("Content-Length", totalLength);
      res.setHeader("Content-Type", record.mimeType);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.send(buffer);
    } catch (error) {
      console.error("[Videos] Failed to serve video", error);
      res.status(500).send("Failed to load video");
    }
  });
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const xml = await generateSitemapXml();
      res
        .status(200)
        .set({
          "Content-Type": "application/xml",
          "Cache-Control": "public, max-age=3600",
        })
        .send(xml);
    } catch (error) {
      console.error("[sitemap] Failed to generate sitemap", error);
      res.status(500).send("Failed to generate sitemap");
    }
  });
  app.get("/robots.txt", (_req, res) => {
    const robots = generateRobotsTxt();
    res
      .status(200)
      .set({
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600",
      })
      .send(robots);
  });
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
