// Environment variables
export const VERSION: string | undefined =
  process.env.NEXT_PUBLIC_KEINPLAN_VERSION;
export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Query keys
export const BACKEND_INFO_KEY: string = "backend_info";
