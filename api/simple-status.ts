import type { VercelApiHandler } from "@vercel/node";
import axios, { AxiosError } from "axios";
import { allowCors } from "../middleware/cors";
import { pipe } from "../middleware/pipe";
import { swrCache } from "../middleware/swr";
import { ChecklyApiResponse } from "../types/ChecklyApi";
import { validateEndpoint } from "../utils/env";

const { VERCEL_URL } = process.env;

type SimpleStatusStatus = "ok" | "error" | "degraded" | "unknown";
interface SimpleStatus {
  status: SimpleStatusStatus;
}

const transformStatusToSimpleStatus = (
  statusResponse: ChecklyApiResponse
): SimpleStatus => {
  const relevantChecks = statusResponse.filter(
    ({ updated_at }) =>
      new Date(updated_at) > new Date(Date.now() - 1000 * 60 * 60 * 4) // only show checks that have been updated in the last 4 hours
  );
  const failedChecks = relevantChecks.filter(
    ({ hasFailures, hasErrors }) => hasFailures || hasErrors
  );
  const degradedChecks = relevantChecks.filter(({ isDegraded }) => isDegraded);

  const status: SimpleStatusStatus =
    relevantChecks.length === 0 // if there are no relevant checks, the status is unknown
      ? "unknown"
      : failedChecks.length > relevantChecks.length / 2 // if more than half of the checks have failed, the status is error
      ? "error"
      : degradedChecks.length > 0 || failedChecks.length > 0 // if there are failed or degraded checks, the status is degraded
      ? "degraded"
      : "ok";

  return {
    status,
  };
};

const handler: VercelApiHandler = async (_request, response) => {
  const isValidEndpoint = validateEndpoint(VERCEL_URL);
  if (!isValidEndpoint) {
    return response.status(500).send("No vercel endpoint provided in ENV");
  }

  try {
    const { data } = await axios.get<ChecklyApiResponse>(
      `http://${VERCEL_URL}/api/status`, // fetch the status using the own endpoint to leverage the cache
      { validateStatus: (status) => status === 200, responseType: "json" }
    );

    return response.status(200).json(transformStatusToSimpleStatus(data));
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      return response.status(error.response.status).send(error.response.data);
    }
    return response.status(500).send("Error fetching endpoint");
  }
};

export default pipe(allowCors, swrCache())(handler);
