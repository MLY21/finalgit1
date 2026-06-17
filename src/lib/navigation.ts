import {
  BarChart3,
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  User,
  Users,
} from "lucide-react";

import type { NavigationItem } from "@/types";

export const navigationItems: NavigationItem[] = [
  {
    key: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: "dashboard:view",
  },
  {
    key: "clients",
    href: "/dashboard/clients",
    icon: Users,
    permission: "clients:view",
  },
  {
    key: "campaigns",
    href: "/dashboard/campaigns",
    icon: Megaphone,
    permission: "campaigns:view",
  },
  {
    key: "analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    permission: "analytics:view",
  },
  {
    key: "profile",
    href: "/dashboard/profile",
    icon: User,
    permission: "profile:view",
  },
];

export const userNavigationItems: NavigationItem[] = [
  {
    key: "userDashboard",
    href: "/user",
    icon: LayoutDashboard,
    permission: "user:dashboard:view",
  },
  {
    key: "userCampaigns",
    href: "/user/campaigns",
    icon: Megaphone,
    permission: "user:campaigns:view",
  },
  {
    key: "userReports",
    href: "/user/reports",
    icon: FileText,
    permission: "user:reports:view",
  },
  {
    key: "userProfile",
    href: "/user/profile",
    icon: User,
    permission: "user:profile:view",
  },
];
