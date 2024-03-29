// Environment variables and backend info
export const VERSION: string | undefined =
  process.env.NEXT_PUBLIC_KEINPLAN_VERSION;
export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "";
export const API_BASE_URL_SERVER: string =
  process.env.SERVER_API_BASE_URL || "";

export const BACKEND_INFO_CACHE_TIME: number = 60 * 60 * 24;

// Query keys
