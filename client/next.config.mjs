/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    // Allow importing shared server utilities from the repo root (e.g. server/db).
    externalDir: true,
  },
};

export default nextConfig;

