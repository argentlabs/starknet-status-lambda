import type { VercelApiHandler } from "@vercel/node";

// from https://vercel.com/support/articles/how-to-enable-cors
// allow all CORS requests as this endpoint should be usable by the community
export const allowCors =
  (fn: VercelApiHandler): VercelApiHandler =>
  async (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }
    return fn(req, res);
  };
