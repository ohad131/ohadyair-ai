import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../src/db/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  /**
   * Raw bearer token supplied for admin routes. The token is extracted once
   * when creating the tRPC context so downstream procedures can simply compare
   * it against the expected environment variable without re-parsing headers.
   */
  adminToken: string | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  let adminToken: string | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  const authHeader = opts.req.headers["authorization"];
  if (typeof authHeader === "string") {
    const [scheme, token] = authHeader.split(" ");
    if (scheme?.toLowerCase() === "bearer" && token) {
      adminToken = token;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    adminToken,
  };
}
