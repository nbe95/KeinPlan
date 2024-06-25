// Environment variables (fixed at build-time)
export const PROD: boolean = process.env.NODE_ENV == "production";
export const VERSION_FRONTEND: string = process.env.NEXT_PUBLIC_VERSION_FRONTEND || "";
export const GITHUB_LINK: string = process.env.NEXT_PUBLIC_GITHUB_LINK || "";
export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Environment variables (dynamic at runtime)
export const ADMIN_MAIL: string = process.env.ADMIN_MAIL || "";
export const TIME_SHEET_MAIL: string = process.env.TIME_SHEET_MAIL || "";
export const KAPLAN_LINK: string = process.env.KAPLAN_LINK || "";

// API endpoints
export const API_ENDPOINT_VERSION: string = `${API_BASE_URL}/version`;
export const API_ENDPOINT_KAPLAN: string = `${API_BASE_URL}/kaplan`;
export const API_ENDPOINT_TIME_SHEET: string = `${API_BASE_URL}/time-sheet`;

// Query keys
export const KAPLAN_QUERY_KEY: string = "kaplan";
export const TIME_SHEET_QUERY_KEY: string = "time-sheet";

// Miscellaneous
export const KAPLAN_ICS_HEADER: string = "X-KaPlan-ICS";
