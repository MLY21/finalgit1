"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth-provider";

/**
 * Placeholder for future role-based routing.
 *
 * Intended behaviour once real auth (JWT/session) is wired up:
 *   - role "admin"  -> redirect to /dashboard
 *   - role "client" -> allow /user
 *
 * Kept disabled for now so the client dashboard is previewable with the
 * current mock session (which is an admin). Flip ENFORCE to true when
 * authentication is implemented.
 */
const ENFORCE_ROLE_ROUTING = false;

export function ClientAccessGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ENFORCE_ROLE_ROUTING) return;
    if (user?.role === "admin") {
      router.replace("/dashboard");
    }
  }, [user?.role, router]);

  return <>{children}</>;
}
