"use client";

import { ClientSidebarNav } from "@/components/client/client-sidebar-nav";
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

interface ClientSidebarProps {
  className?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function ClientSidebar({
  className,
  isExpanded = false,
  onToggle,
}: ClientSidebarProps) {
  return (
    <aside
      data-sidebar
      className={cn(
        "fixed inset-y-0 start-0 z-40 hidden shrink-0 flex-col border-e border-border bg-card transition-all duration-300 lg:flex",
        isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED,
        className
      )}
    >
      <ClientSidebarNav iconOnly={!isExpanded} onToggle={onToggle} />
    </aside>
  );
}
