import type { NextFunction, Request, Response } from "express";

function extractBearerToken(header: string | undefined): string | null {
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "bearer") return null;
  return token.trim() || null;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const configuredToken = process.env.ADMIN_TOKEN;
  const providedToken = extractBearerToken(req.header("authorization"));

  if (!configuredToken || !providedToken || providedToken !== configuredToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
