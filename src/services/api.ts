export const API_BASE_URL = "https://ecommerce.routemisr.com/api/v1";
export const API_V2_BASE_URL = "https://ecommerce.routemisr.com/api/v2";

type ApiOptions = RequestInit & {
  token?: string;
  version?: "v1" | "v2";
};

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { token, version = "v1", ...requestOptions } = options;
  const headers = new Headers(requestOptions.headers);

  if (requestOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("token", token);
  }

  const apiBaseUrl = version === "v2" ? API_V2_BASE_URL : API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...requestOptions,
    headers,
    cache: requestOptions.cache ?? "no-store",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || "Something went wrong. Please try again.",
    );
  }

  return result as T;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}
