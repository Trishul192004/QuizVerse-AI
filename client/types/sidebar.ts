import {
  LayoutDashboard,
  GraduationCap,
  Brain,
  Swords,
  BookOpen,
  User,
} from "lucide-react";

export const sidebarItems = [
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
        href: "/teacher/quizzes",
        icon: Brain,
      },
      {
        title: "Battle Arena",
        href: "/teacher/battle",
        icon: Swords,
      },
      {
        title: "AI Study",
        href: "/teacher/rag",
        icon: BookOpen,
      },
      {
        title: "Profile",
        href: "/teacher/profile",
        icon: User,
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
        title: "Classrooms",
        href: "/student/classrooms",
        icon: GraduationCap,
      },
      {
        title: "AI Quiz",
        href: "/student/quizzes",
        icon: Brain,
      },
      {
        title: "Battle Arena",
        href: "/student/battle",
        icon: Swords,
      },
      {
        title: "AI Study",
        href: "/student/rag",
        icon: BookOpen,
      },
      {
        title: "Profile",
        href: "/student/profile",
        icon: User,
      },
    ],
  },
];