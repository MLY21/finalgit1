export const APP_NAME = "AdCentral";
export const APP_DESCRIPTION =
  "Digital Marketing Campaign Management System";

// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

// Authentication Configuration
export const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";

// Database Configuration
export const DATABASE_URL = process.env.DATABASE_URL;

// NextAuth Configuration
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

// Environment
export const NODE_ENV = process.env.NODE_ENV ?? "development";
