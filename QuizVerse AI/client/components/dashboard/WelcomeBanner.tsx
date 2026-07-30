"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function WelcomeBanner() {
  const { user } = useAuth();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="
        rounded-2xl
        bg-gradient-to-r
        from-indigo-600
        via-purple-600
        to-cyan-500
        p-8
        text-white
      "
    >
      <h1 className="text-4xl font-bold">
        Welcome back 👋
      </h1>

      <p className="mt-3 text-lg opacity-90">
        {user?.username ?? "Teacher"}, ready to create engaging AI-powered quizzes today?
      </p>
      </div>
  );
}