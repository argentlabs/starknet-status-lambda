import type { VercelApiHandler } from "@vercel/node";

interface SwrConfig {
  maxAge?: number;
  staleWhileRevalidate?: number;
}

// allow all CORS requests as this endpoint should be usable by the community
export const swrCache =
  (
    { maxAge = 10, staleWhileRevalidate = 50 }: SwrConfig = {} // default: Cache for 10 seconds and allow stale values to be served up to 50 seconds
  ) =>
  (fn: VercelApiHandler): VercelApiHandler =>
  async (req, res) => {
    res.setHeader(
      "Cache-Control",
      `s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
    );

    return fn(req, res);
  };
