export type UserRole = "admin" | "manager" | "analyst" | "client";

export type Permission =
  | "dashboard:view"
  | "clients:view"
  | "clients:manage"
  | "campaigns:view"
  | "campaigns:manage"
  | "analytics:view"
  | "finance:view"
  | "finance:manage"
  | "profile:view"
  | "settings:view"
  | "settings:manage"
  | "user:dashboard:view"
  | "user:campaigns:view"
  | "user:reports:view"
  | "user:profile:view";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
}

export interface Session {
  user: User;
  accessToken: string;
  expiresAt: string;
}
