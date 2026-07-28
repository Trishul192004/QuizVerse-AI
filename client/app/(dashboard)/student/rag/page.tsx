"use client";

import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function StudentRagPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-8 text-4xl font-bold text-white">
        AI Study
      </h1>

      <Card className="border-slate-800 bg-slate-900 shadow-xl">
        <CardContent className="p-10">

          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-violet-600/20">
              <BookOpen className="h-10 w-10 text-violet-400" />
            </div>

            <h2 className="text-3xl font-bold text-white">
              AI Study is a Teacher Feature
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Teachers use AI Study to upload PDF study materials,
              generate AI-powered quizzes, and publish them directly
              to your classroom.
            </p>
          </div>

          {/* Divider */}
          <div className="my-10 border-t border-slate-700" />

          {/* Student Instructions */}
          <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-8">

            <div className="mb-6 flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-violet-400" />
              <h3 className="text-2xl font-semibold text-white">
                Student Instructions
              </h3>
            </div>

            <ul className="space-y-5 text-lg text-slate-300">
              <li className="flex gap-3">
                <span className="text-violet-400 font-bold">✓</span>
                Students cannot create AI-generated quizzes.
              </li>

              <li className="flex gap-3">
                <span className="text-violet-400 font-bold">✓</span>
                Your teacher will upload study materials and publish
                AI-generated quizzes for your classroom.
              </li>

              <li className="flex gap-3">
                <span className="text-violet-400 font-bold">✓</span>
                Open <strong className="text-white">My Classrooms</strong>.
              </li>

              <li className="flex gap-3">
                <span className="text-violet-400 font-bold">✓</span>
                Select your classroom and look for quizzes labelled{" "}
                <span className="font-semibold text-violet-300">
                  "Generated from uploaded PDF"
                </span>.
              </li>

              <li className="flex gap-3">
                <span className="text-violet-400 font-bold">✓</span>
                Click <strong className="text-white">Start Quiz</strong> to
                begin your AI Study assessment.
              </li>
            </ul>
          </div>

          {/* Button */}
          <div className="mt-10 flex justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/student/classrooms")}
              className="h-14 rounded-xl bg-violet-600 px-10 text-lg font-semibold hover:bg-violet-700"
            >
              Go to My Classrooms
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}