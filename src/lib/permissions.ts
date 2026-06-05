import type { Permission, UserRole } from "@/types/auth";

export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    "dashboard:view",
    "clients:view",
    "clients:manage",
    "campaigns:view",
    "campaigns:manage",
    "analytics:view",
    "finance:view",
    "finance:manage",
    "profile:view",
    "settings:view",
    "settings:manage",
  ],
  manager: [
    "dashboard:view",
    "clients:view",
    "clients:manage",
    "campaigns:view",
    "campaigns:manage",
    "analytics:view",
    "finance:view",
    "profile:view",
    "settings:view",
  ],
  analyst: [
    "dashboard:view",
    "campaigns:view",
    "analytics:view",
    "profile:view",
  ],
  client: ["dashboard:view", "campaigns:view", "analytics:view"],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}
