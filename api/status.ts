import type { VercelApiHandler } from "@vercel/node";
import axios from "axios";
import { allowCors } from "../middleware/cors";
import { pipe } from "../middleware/pipe";
import { swrCache } from "../middleware/swr";
import { parseHeaders, validateEndpoint } from "../utils/env";

const { HEADERS, ENDPOINT } = process.env;

const handler: VercelApiHandler = async (_request, response) => {
  const isValidEndpoint = validateEndpoint(ENDPOINT);
  if (!isValidEndpoint) {
    return response.status(500).send("No endpoint provided in ENV");
  }

  try {
    const headers = parseHeaders(HEADERS);
    const { status, data } = await axios.get(ENDPOINT, {
      headers,
      validateStatus: () => true,
      responseType: "text",
    });

    return response.status(status).send(data);
  } catch (error) {
    console.error(error);
    return response.status(500).send("Error fetching endpoint");
  }
};

export default pipe(allowCors, swrCache())(handler);
