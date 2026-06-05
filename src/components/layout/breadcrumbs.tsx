"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { navigationItems, userNavigationItems } from "@/lib/navigation";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

interface Crumb {
  href: string;
  label: string;
}

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const t = useTranslations();

  const segments = pathname.split("/").filter(Boolean);
  const isUserRoute = pathname.startsWith("/user");

  const navItems = isUserRoute ? userNavigationItems : navigationItems;

  const crumbs: Crumb[] = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const navItem = navItems.find((item) => item.href === href);

    let label: string;
    if (navItem) {
      label = isUserRoute ? t(`nav.${navItem.key}`) : t(`nav.${navItem.key}`);
    } else if (isUserRoute) {
      // Handle user-specific dynamic routes
      if (segment === "campaigns" && segments.includes("[id]")) {
        label = t("nav.userCampaigns");
      } else if (segment === "[id]") {
        label = "Campaign Details";
      } else {
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }
    } else {
      label = segment.charAt(0).toUpperCase() + segment.slice(1);
    }

    return { href, label };
  });

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex min-w-0 items-center", className)}
    >
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <Fragment key={crumb.href}>
              <li className="flex min-w-0 items-center">
                {isLast ? (
                  <span
                    aria-current="page"
                    className="truncate font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="truncate rounded-md text-zinc-500 outline-none transition-colors hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-400 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-600"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
              {!isLast ? (
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-zinc-400 rtl:rotate-180 dark:text-zinc-600"
                />
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
