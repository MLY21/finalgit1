"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleLogout = () => {
    onNavigate?.();
    // Placeholder for future JWT/session sign-out.
    router.push("/");
  };

  return (
    <div className={cn("flex h-full flex-col", iconOnly && "items-center")}>
      <div
        className={cn(
          "flex w-full border-b border-zinc-200 dark:border-zinc-800",
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
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            <Home className="size-5" />
          </div>
          {!iconOnly ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                CampaignHub
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
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
          "w-full border-t border-zinc-200 dark:border-zinc-800",
          iconOnly ? "flex justify-center p-2" : "p-3"
        )}
      >
        <button
          type="button"
          onClick={handleLogout}
          title={iconOnly ? "Logout" : undefined}
          aria-label="Logout"
          className={cn(
            "flex items-center rounded-xl border border-transparent text-sm font-medium text-zinc-600 outline-none transition-all duration-200 hover:border-zinc-200 hover:bg-white hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-400 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-600",
            iconOnly ? "size-11 justify-center" : "w-full gap-3 px-3 py-2.5"
          )}
        >
          <LogOut className="size-4 shrink-0 text-zinc-500 dark:text-zinc-500" />
          {!iconOnly ? <span>Logout</span> : null}
        </button>
      </div>
    </div>
  );
}
