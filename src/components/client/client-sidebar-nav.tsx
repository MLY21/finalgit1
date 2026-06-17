"use client";

import Link from "next/link";
import { Home, LogOut } from "lucide-react";

import { NavLink } from "@/components/layout/nav-link";
import { clientNavItems } from "@/lib/client-navigation";
import { cn } from "@/lib/utils";

interface ClientSidebarNavProps {
  onNavigate?: () => void;
  iconOnly?: boolean;
  onToggle?: () => void;
}

export function ClientSidebarNav({
  onNavigate,
  iconOnly = false,
  onToggle,
}: ClientSidebarNavProps) {
  const handleLogout = async () => {
    onNavigate?.();
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className={cn("flex h-full flex-col", iconOnly && "items-center")}>
      <div
        className={cn(
          "flex w-full border-b border-border",
          iconOnly ? "justify-center px-2 py-4" : "items-center gap-3 px-5 py-5"
        )}
      >
        <Link
          href="/user"
          onClick={onNavigate}
          title={iconOnly ? "Client Portal" : undefined}
          aria-label="Client Portal"
          className={cn(
            "flex items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
            iconOnly ? "justify-center" : "min-w-0 flex-1 gap-3"
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Home className="size-5" />
          </div>
          {!iconOnly ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                AdCentral
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Client Portal
              </p>
            </div>
          ) : null}
        </Link>
      </div>

      <nav
        className={cn(
          "flex flex-1 flex-col overflow-y-auto",
          iconOnly ? "items-center gap-2 p-2" : "space-y-1 p-3"
        )}
      >
        {clientNavItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            title={item.title}
            icon={item.icon}
            onNavigate={onNavigate}
            iconOnly={iconOnly}
            exact={item.exact}
            onToggle={item.href === "/user" ? onToggle : undefined}
          />
        ))}
      </nav>

      <div
        className={cn(
          "w-full border-t border-border",
          iconOnly ? "flex justify-center p-2" : "p-3"
        )}
      >
        <button
          type="button"
          onClick={handleLogout}
          title={iconOnly ? "Logout" : undefined}
          aria-label="Logout"
          className={cn(
            "flex items-center rounded-xl border border-transparent text-sm font-medium text-muted-foreground outline-none transition-all duration-200 hover:border-border hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20",
            iconOnly ? "size-11 justify-center" : "w-full gap-3 px-3 py-2.5"
          )}
        >
          <LogOut className="size-4 shrink-0 text-muted-foreground" />
          {!iconOnly ? <span>Logout</span> : null}
        </button>
      </div>
    </div>
  );
}
