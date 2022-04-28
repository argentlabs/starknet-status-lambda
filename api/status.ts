import type { VercelApiHandler } from "@vercel/node";
import axios, { AxiosRequestHeaders } from "axios";
import { allowCors } from "../lib/cors";

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

export default allowCors(handler);
