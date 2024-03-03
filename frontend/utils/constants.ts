// Environment variables and backend info
export const PROD: boolean = process.env.NODE_ENV == "production";
export const VERSION: string | null = process.env.NEXT_PUBLIC_KEINPLAN_VERSION;

export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "";
export const API_BASE_URL_SERVER: string =
  process.env.SERVER_API_BASE_URL || "";

export const BACKEND_INFO_CACHE_TIME: number = 60 * 60 * 24;

// Query keys
export const KAPLAN_QUERY_KEY: string = "kaplan";
export const TIME_SHEET_QUERY_KEY: string = "time-sheet";

// Miscellaneous
export const KAPLAN_ICS_HEADER: string = "X-KaPlan-ICS";
