"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { BrainCircuit, Trophy, Users, Sparkles } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT PANEL */}

      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600 text-white p-12">

        <div>

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <BrainCircuit size={40} />

            <div>

              <h1 className="text-4xl font-bold">
                QuizVerse AI
              </h1>

              <p className="text-blue-100">
                AI Powered Learning Platform
              </p>

            </div>

          </Link>

        </div>

        <div>

          <h2 className="text-5xl font-bold leading-tight mb-8">
            Learn.
            <br />
            Compete.
            <br />
            Grow.
          </h2>

          <div className="space-y-6">

            <div className="flex gap-4">

              <Sparkles />

              <div>

                <h3 className="font-semibold">
                  AI Generated Quizzes
                </h3>

                <p className="text-blue-100">
                  Dynamic quizzes generated from trusted sources.
                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <Users />

              <div>

                <h3 className="font-semibold">
                  Live Multiplayer Classrooms
                </h3>

                <p className="text-blue-100">
                  Join teachers and compete in real time.
                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <Trophy />

              <div>

                <h3 className="font-semibold">
                  Global Leaderboards
                </h3>

                <p className="text-blue-100">
                  Earn XP, coins and achievements.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="flex items-center justify-center bg-gray-50 p-8">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">

          <h2 className="text-3xl font-bold">
            {title}
          </h2>

          <p className="text-gray-500 mt-2 mb-8">
            {subtitle}
          </p>

          {children}

        </div>

      </div>

    </div>
  );
}