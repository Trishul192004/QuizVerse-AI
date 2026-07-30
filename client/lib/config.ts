export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const SOCKET_BASE_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
