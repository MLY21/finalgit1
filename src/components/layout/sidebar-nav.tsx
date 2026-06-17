"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Home, LogOut, ChevronDown, ChevronRight, Plus, List, BarChart3, TrendingUp } from "lucide-react";

import { NavLink } from "@/components/layout/nav-link";
import { useNavigation } from "@/hooks/use-navigation";
import { useTranslations } from "@/providers/locale-provider";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  onNavigate?: () => void;
  iconOnly?: boolean;
  onToggle?: () => void;
}

export function SidebarNav({ onNavigate, iconOnly = false, onToggle }: SidebarNavProps) {
  const t = useTranslations();
  const navItems = useNavigation();
  const pathname = usePathname();

  const isClientsRoute = pathname.startsWith("/dashboard/clients");
  const [isClientsOpen, setIsClientsOpen] = useState(isClientsRoute);

  const isCampaignsRoute = pathname.startsWith("/dashboard/campaigns");
  const [isCampaignsOpen, setIsCampaignsOpen] = useState(isCampaignsRoute);

  const isAnalyticsRoute = pathname.startsWith("/dashboard/analytics");
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(isAnalyticsRoute);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  useEffect(() => {
    if (isClientsRoute) {
      setIsClientsOpen(true);
    }
  }, [pathname, isClientsRoute]);

  useEffect(() => {
    if (isCampaignsRoute) {
      setIsCampaignsOpen(true);
    }
  }, [pathname, isCampaignsRoute]);

  useEffect(() => {
    if (isAnalyticsRoute) {
      setIsAnalyticsOpen(true);
    }
  }, [pathname, isAnalyticsRoute]);

  return (
    <div
      className={cn(
        "flex h-full flex-col",
        iconOnly && "items-center"
      )}
    >
      <div
        className={cn(
          "flex w-full border-b border-border",
          iconOnly ? "justify-center px-2 py-4" : "items-center gap-3 px-5 py-5"
        )}
      >
        <Link
          href="/dashboard"
          onClick={onNavigate}
          title={iconOnly ? t("app.name") : undefined}
          aria-label={t("app.name")}
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
                {t("app.name")}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {t("app.tagline")}
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
        {navItems.map((item) => {
          if (item.key === "clients") {
            const isAllClientsActive = pathname === "/dashboard/clients";
            const isNewClientActive = pathname === "/dashboard/clients/new";

            return (
              <div key={item.key} className="w-full space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    if (iconOnly && onToggle) {
                      onToggle();
                      setIsClientsOpen(true);
                    } else {
                      setIsClientsOpen(!isClientsOpen);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center rounded-xl border border-transparent text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
                    iconOnly ? "size-11 justify-center" : "gap-3 px-3 py-2.5 justify-between",
                    isClientsRoute
                      ? "border-border bg-accent text-primary shadow-sm"
                      : "text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "shrink-0",
                        iconOnly ? "size-5" : "size-4",
                        isClientsRoute
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    {!iconOnly && <span>{item.title}</span>}
                  </div>
                  {!iconOnly && (
                    isClientsOpen ? (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="size-4 text-muted-foreground" />
                    )
                  )}
                </button>

                {!iconOnly && isClientsOpen && (
                  <div className="pl-9 pr-1 space-y-1">
                    <Link
                      href="/dashboard/clients"
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 outline-none",
                        isAllClientsActive
                          ? "bg-accent text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <List className="size-3.5" />
                      <span>All Clients</span>
                    </Link>
                    <Link
                      href="/dashboard/clients/new"
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 outline-none",
                        isNewClientActive
                          ? "bg-accent text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Plus className="size-3.5" />
                      <span>Add Client</span>
                    </Link>
                  </div>
                )}
              </div>
            );
          }

          if (item.key === "campaigns") {
            const isAllCampaignsActive = pathname === "/dashboard/campaigns";
            const isImportCampaignsActive = pathname === "/dashboard/campaigns/import";

            return (
              <div key={item.key} className="w-full space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    if (iconOnly && onToggle) {
                      onToggle();
                      setIsCampaignsOpen(true);
                    } else {
                      setIsCampaignsOpen(!isCampaignsOpen);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center rounded-xl border border-transparent text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
                    iconOnly ? "size-11 justify-center" : "gap-3 px-3 py-2.5 justify-between",
                    isCampaignsRoute
                      ? "border-border bg-accent text-primary shadow-sm"
                      : "text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "shrink-0",
                        iconOnly ? "size-5" : "size-4",
                        isCampaignsRoute
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    {!iconOnly && <span>{item.title}</span>}
                  </div>
                  {!iconOnly && (
                    isCampaignsOpen ? (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="size-4 text-muted-foreground" />
                    )
                  )}
                </button>

                {!iconOnly && isCampaignsOpen && (
                  <div className="pl-9 pr-1 space-y-1">
                    <Link
                      href="/dashboard/campaigns"
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 outline-none",
                        isAllCampaignsActive
                          ? "bg-accent text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <List className="size-3.5" />
                      <span>All Campaigns</span>
                    </Link>
                    <Link
                      href="/dashboard/campaigns/import"
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 outline-none",
                        isImportCampaignsActive
                          ? "bg-accent text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Plus className="size-3.5" />
                      <span>Import Campaigns</span>
                    </Link>
                  </div>
                )}
              </div>
            );
          }

          if (item.key === "analytics") {
            const isOverviewActive = pathname === "/dashboard/analytics";
            const isInsightsActive = pathname === "/dashboard/analytics/insights";

            return (
              <div key={item.key} className="w-full space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    if (iconOnly && onToggle) {
                      onToggle();
                      setIsAnalyticsOpen(true);
                    } else {
                      setIsAnalyticsOpen(!isAnalyticsOpen);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center rounded-xl border border-transparent text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
                    iconOnly ? "size-11 justify-center" : "gap-3 px-3 py-2.5 justify-between",
                    isAnalyticsRoute
                      ? "border-border bg-accent text-primary shadow-sm"
                      : "text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "shrink-0",
                        iconOnly ? "size-5" : "size-4",
                        isAnalyticsRoute
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    {!iconOnly && <span>{item.title}</span>}
                  </div>
                  {!iconOnly && (
                    isAnalyticsOpen ? (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="size-4 text-muted-foreground" />
                    )
                  )}
                </button>

                {!iconOnly && isAnalyticsOpen && (
                  <div className="pl-9 pr-1 space-y-1">
                    <Link
                      href="/dashboard/analytics"
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 outline-none",
                        isOverviewActive
                          ? "bg-accent text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <BarChart3 className="size-3.5" />
                      <span>Overview</span>
                    </Link>
                    <Link
                      href="/dashboard/analytics/insights"
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 outline-none",
                        isInsightsActive
                          ? "bg-accent text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <TrendingUp className="size-3.5" />
                      <span>Campaign Insights</span>
                    </Link>
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.href}
              href={item.href}
              title={item.title}
              icon={item.icon}
              onNavigate={onNavigate}
              iconOnly={iconOnly}
              exact={item.href === "/dashboard"}
              onToggle={item.href === "/dashboard" ? onToggle : undefined}
            />
          );
        })}
      </nav>

      {!iconOnly ? (
        <div className="w-full border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
          >
            <LogOut className="size-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      ) : (
        <div className="flex w-full justify-center border-t border-border p-3">
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex size-10 items-center justify-center rounded-xl border border-border bg-secondary text-foreground transition-all duration-200 hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

