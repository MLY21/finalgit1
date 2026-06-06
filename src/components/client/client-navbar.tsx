"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Bell, Menu, Search, User, LogOut } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clientInfo } from "@/data/client-dashboard";
import { clientNavItems } from "@/lib/client-navigation";

interface ClientNavbarProps {
  onMenuClick?: () => void;
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/user/campaigns/")) return "Campaign Details";

  const match = [...clientNavItems]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) =>
      item.exact ? pathname === item.href : pathname.startsWith(item.href)
    );

  return match?.title ?? "Overview";
}

export function ClientNavbar({ onMenuClick }: ClientNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const title = getPageTitle(pathname);

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-4 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="size-9 shrink-0 rounded-lg text-muted-foreground hover:bg-accent hover:text-primary lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>

      <h1 className="min-w-0 flex-1 truncate text-base font-semibold tracking-tight text-foreground">
        {title}
      </h1>

      <div className="ms-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden w-56 lg:block xl:w-72">
          <div className="relative">
            <Search className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search campaigns..."
              className="h-9 rounded-lg border-border bg-secondary ps-10 text-sm"
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-primary"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute end-2 top-2 size-2 rounded-full bg-primary ring-2 ring-card" />
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-primary"
                aria-label="Profile"
              >
                <User className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              render={<Link href="/user/profile" />}
            >
              <User className="size-4 text-muted-foreground" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
            >
              <LogOut className="size-4 text-muted-foreground" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
