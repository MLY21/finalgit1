"use client";

import { createContext, useContext, useMemo } from "react";

import { hasPermission } from "@/lib/permissions";
import type { Session, User } from "@/types/auth";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  hasPermission: (permission: Parameters<typeof hasPermission>[1]) => boolean;
}

const mockSession: Session = {
  user: {
    id: "1",
    name: "Mohammed Khalid",
    email: "mohammed@agency.com",
    role: "admin",
    avatarInitials: "MK",
  },
  accessToken: "mock-token",
  expiresAt: new Date(Date.now() + 86400000).toISOString(),
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = mockSession;

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session.user,
      isAuthenticated: true,
      hasPermission: (permission) =>
        hasPermission(session.user.role, permission),
    }),
    [session]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
