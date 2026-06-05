import type { ApiError, ApiResponse } from "@/types/api";

export class ApiClientError extends Error {
  status: number;
  code?: string;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiClientError";
    this.status = error.status;
    this.code = error.code;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...rest } = options;

  const url = new URL(endpoint, getBaseUrl());

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = {
      message: response.statusText || "Request failed",
      status: response.status,
    };

    throw new ApiClientError(error);
  }

  const json = (await response.json()) as ApiResponse<T> | T;

  if (typeof json === "object" && json !== null && "data" in json) {
    return (json as ApiResponse<T>).data;
  }

  return json as T;
}

function getBaseUrl() {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
  }

  return process.env.NEXT_PUBLIC_API_URL ?? "/api";
}
