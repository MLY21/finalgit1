import { BarChart3, LayoutDashboard, Megaphone, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ClientNavItem {
  key: string;
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const clientNavItems: ClientNavItem[] = [
  { key: "overview", title: "Overview", href: "/user", icon: LayoutDashboard, exact: true },
  { key: "campaigns", title: "My Campaigns", href: "/user/campaigns", icon: Megaphone },
  { key: "reports", title: "Reports", href: "/user/reports", icon: BarChart3 },
  { key: "profile", title: "Profile", href: "/user/profile", icon: User },
];
