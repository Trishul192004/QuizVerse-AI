import { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface SidebarSection {
  role: "teacher" | "student" | "admin";
  items: SidebarItem[];
}