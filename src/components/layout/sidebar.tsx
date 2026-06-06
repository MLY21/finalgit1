"use client";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { cn } from "@/lib/utils";

export const SIDEBAR_WIDTH_COLLAPSED = "w-[4.5rem]";
export const SIDEBAR_WIDTH_EXPANDED = "w-72";

interface SidebarProps {
  className?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ className, isExpanded = false, onToggle }: SidebarProps) {
  return (
    <aside
      data-sidebar
      className={cn(
        "fixed inset-y-0 start-0 z-40 hidden shrink-0 flex-col border-e border-border bg-card lg:flex transition-all duration-300",
        isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED,
        className
      )}
    >
      <SidebarNav iconOnly={!isExpanded} onToggle={onToggle} />
    </aside>
  );
}
