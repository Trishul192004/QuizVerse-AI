import {
  LayoutDashboard,
  GraduationCap,
  BrainCircuit,
  Trophy,
  Users,
  UserCircle,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { SidebarSection } from "@/types/sidebar";

export const sidebarItems: SidebarSection[] = [
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
        title: "Leaderboard",
        href: "/leaderboard",
        icon: Trophy,
      },
      {
        title: "Profile",
        href: "/profile",
        icon: UserCircle,
      },
    ],
  },

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
        title: "Friends",
        href: "/friends",
        icon: Users,
      },
      {
        title: "Leaderboard",
        href: "/leaderboard",
        icon: Trophy,
      },
      {
        title: "Profile",
        href: "/profile",
        icon: UserCircle,
      },
    ],
  },

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