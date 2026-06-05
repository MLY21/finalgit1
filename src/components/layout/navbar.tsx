"use client";

import Link from "next/link";
import { Bell, Globe, Menu, Plus, Search, Megaphone, Users, LogOut, User } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth-provider";
import { useTranslations } from "@/providers/locale-provider";

interface NavbarProps {
  title?: string;
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const t = useTranslations();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="size-9 shrink-0 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 lg:hidden"
        onClick={onMenuClick}
        aria-label={t("navbar.openMenu")}
      >
        <Menu className="size-5" />
      </Button>

      <Breadcrumbs className="min-w-0 flex-1" />

      <div className="ms-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden w-64 lg:block xl:w-80">
          <div className="relative">
            <Search className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="search"
              placeholder={t("navbar.searchPlaceholder")}
              className="h-9 rounded-lg border-zinc-200 bg-zinc-50 ps-10 text-sm dark:border-zinc-800 dark:bg-zinc-900"
            />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                className="h-9 rounded-lg px-3 text-xs font-medium"
                aria-label="New"
              />
            }
          >
            <Plus className="size-4" />
            <span className="ml-1.5 hidden sm:inline">New</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              render={<Link href="/dashboard/campaigns" />}
            >
              <Megaphone className="size-4 text-zinc-500 dark:text-zinc-400" />
              <span>New Campaign</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href="/dashboard/clients" />}
            >
              <Users className="size-4 text-zinc-500 dark:text-zinc-400" />
              <span>New Client</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="relative size-9 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label={t("navbar.notifications")}
          >
            <Bell className="size-4" />
            <span className="absolute end-2 top-2 size-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-zinc-950" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden size-9 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 sm:flex"
            aria-label={t("navbar.changeLanguage")}
          >
            <Globe className="size-4" />
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  aria-label="Profile"
                >
                  <User className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                render={<Link href="/dashboard/profile" />}
              >
                <User className="size-4 text-zinc-500 dark:text-zinc-400" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/" />}
              >
                <LogOut className="size-4 text-zinc-500 dark:text-zinc-400" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
