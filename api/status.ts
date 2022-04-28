import type { VercelApiHandler } from "@vercel/node";
import axios, { AxiosRequestHeaders } from "axios";

const { HEADERS, ENDPOINT } = process.env;

function parseHeaders(headers?: string): AxiosRequestHeaders | undefined {
  try {
    if (!headers) {
      throw new Error("No headers provided");
    }
    return JSON.parse(headers);
  } catch {
    return undefined;
  }
}

function validateEndpoint(endpoint?: string): endpoint is string {
  return Boolean(endpoint);
}

const handler: VercelApiHandler = async (_request, response) => {
  const isValidEndpoint = validateEndpoint(ENDPOINT);
  if (!isValidEndpoint) {
    response.status(500).send("No endpoint provided in ENV");
    return;
  }

  try {
    const headers = parseHeaders(HEADERS);
    const { status, data } = await axios.get(ENDPOINT, {
      headers,
      validateStatus: () => true,
      responseType: "text",
    });

    return response
      .setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=50") // Cache for 10 seconds and allow stale values to be served up to 50 seconds
      .status(status)
      .send(data);
  } catch (error) {
    console.error(error);
    return response.status(500).send("Error fetching endpoint");
  }
};

// solution from https://vercel.com/support/articles/how-to-enable-cors
function allowCors(fn: Function) {
  return async (_request, response) => {
    const whitelist = ["localhost:3000", "playoasis.xyz"];

    const origin = _request.headers.origin;
    if (whitelist.includes(origin)) {
      response.setHeader("Access-Control-Allow-Origin", origin);
    }
    response.setHeader("Access-Control-Allow-Credentials", true);
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    response.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
    if (_request.method === "OPTIONS") {
      response.status(200).end();
      return;
    }
    return await fn(_request, response);
  };
}

export default allowCors(handler);
