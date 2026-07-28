import {
  LayoutDashboard,
  GraduationCap,
  BrainCircuit,
  BookOpen,
  Users,
  Settings,
  ShieldCheck,
  Swords,
} from "lucide-react";

import { SidebarSection } from "@/types/sidebar";

export const sidebarItems: SidebarSection[] = [
  // ==========================
  // Teacher
  // ==========================
  {
    role: "teacher",
    items: [
      {
        title: "Dashboard",
        href: "/teacher/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Classrooms",
        href: "/teacher/classrooms",
        icon: GraduationCap,
      },
      {
        title: "AI Quiz",
        href: "/teacher/ai",
        icon: BrainCircuit,
      },
      {
        title: "Battle Arena",
        href: "/battle",
        icon: Swords,
      },
      {
        title: "AI Study",
        href: "/teacher/rag",
        icon: BookOpen,
      },
    ],
  },

  // ==========================
  // Student
  // ==========================
  {
    role: "student",
    items: [
      {
        title: "Dashboard",
        href: "/student/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "My Classrooms",
        href: "/student/classrooms",
        icon: GraduationCap,
      },
      {
        title: "Join Classroom",
        href: "/student/join",
        icon: Users,
      },
      {
        title: "Battle Arena",
        href: "/battle",
        icon: Swords,
      },
      {
        title: "AI Study",
        href: "/student/rag",
        icon: BookOpen,
      },
    ],
  },

  // ==========================
  // Admin
  // ==========================
  {
    role: "admin",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Security",
        href: "/admin/security",
        icon: ShieldCheck,
      },
    ],
  },
];