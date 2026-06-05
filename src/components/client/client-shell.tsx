"use client";

import { useEffect, useState } from "react";

import { ClientNavbar } from "@/components/client/client-navbar";
import { ClientSidebar } from "@/components/client/client-sidebar";
import { ClientSidebarNav } from "@/components/client/client-sidebar-nav";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    if (!sidebarExpanded) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("[data-sidebar]")) {
        setSidebarExpanded(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [sidebarExpanded]);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <ClientSidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton
          className="w-72 max-w-[85vw] border-zinc-200 bg-white p-0 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <ClientSidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-all duration-300",
          sidebarExpanded ? "lg:ms-72" : "lg:ms-[4.5rem]"
        )}
      >
        <ClientNavbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
