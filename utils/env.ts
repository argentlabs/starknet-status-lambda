import type { AxiosRequestHeaders } from "axios";

export function parseHeaders(
  headers?: string
): AxiosRequestHeaders | undefined {
  try {
    if (!headers) {
      throw new Error("No headers provided");
    }
    return JSON.parse(headers);
  } catch {
    return undefined;
  }
}

export function validateEndpoint(endpoint?: string): endpoint is string {
  return Boolean(endpoint);
}
