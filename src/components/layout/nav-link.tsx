"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  title: string;
  icon: LucideIcon;
  onNavigate?: () => void;
  iconOnly?: boolean;
  onToggle?: () => void;
  exact?: boolean;
}

export function NavLink({
  href,
  title,
  icon: Icon,
  onNavigate,
  iconOnly = false,
  onToggle,
  exact = false,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (onToggle) {
          e.preventDefault();
          onToggle();
        }
        onNavigate?.();
      }}
      title={iconOnly ? title : undefined}
      aria-label={title}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center rounded-xl border border-transparent text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
        iconOnly
          ? "size-11 justify-center"
          : "gap-3 px-3 py-2.5",
        isActive
          ? "border-zinc-200 bg-white text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          : "text-zinc-600 hover:border-zinc-200 hover:bg-white hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-100"
      )}
    >
      <Icon
        className={cn(
          "shrink-0",
          iconOnly ? "size-5" : "size-4",
          isActive
            ? "text-zinc-900 dark:text-zinc-100"
            : "text-zinc-500 dark:text-zinc-500"
        )}
      />
      {!iconOnly ? <span>{title}</span> : null}
    </Link>
  );
}
