"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Trophy, CheckCircle, XCircle, Home, RotateCcw } from "lucide-react";

export default function QuizResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const score = Number(searchParams.get("score") ?? 0);
  const total = Number(searchParams.get("total") ?? 0);
  const correct = Number(searchParams.get("correct") ?? 0);
  const wrong = Number(searchParams.get("wrong") ?? 0);

  const percentage =
    total > 0 ? Math.round((score / total) * 100) : 0;

  const getMessage = () => {
    if (percentage >= 90)
      return {
        title: "Outstanding!",
        message: "Excellent performance. Keep it up!",
      };

    if (percentage >= 75)
      return {
        title: "Great Job!",
        message: "You performed really well.",
      };

    if (percentage >= 50)
      return {
        title: "Good Attempt!",
        message: "Nice effort. A little more practice will help.",
      };

    return {
      title: "Keep Practicing!",
      message: "Don't worry. Practice makes perfect.",
    };
  };

  const feedback = getMessage();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">

      <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-10 shadow-xl">

        <div className="flex flex-col items-center">

          <div className="rounded-full bg-yellow-500/20 p-5">
            <Trophy className="h-14 w-14 text-yellow-400" />
          </div>

          <h1 className="mt-6 text-4xl font-bold text-white">
            Quiz Completed
          </h1>

          <p className="mt-2 text-slate-400">
            {feedback.title}
          </p>

        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl bg-slate-800 p-8 text-center">

            <p className="text-slate-400">
              Score
            </p>

            <h2 className="mt-3 text-6xl font-bold text-violet-400">
              {score}
            </h2>

            <p className="mt-2 text-slate-300">
              out of {total}
            </p>

          </div>

          <div className="rounded-2xl bg-slate-800 p-8 text-center">

            <p className="text-slate-400">
              Percentage
            </p>

            <h2 className="mt-3 text-6xl font-bold text-green-400">
              {percentage}%
            </h2>

            <p className="mt-2 text-slate-300">
              Overall Performance
            </p>

          </div>

        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <div className="flex items-center gap-4 rounded-xl bg-green-900/20 border border-green-700 p-5">

            <CheckCircle className="h-8 w-8 text-green-400" />

            <div>

              <p className="text-green-300 text-sm">
                Correct Answers
              </p>

              <p className="text-3xl font-bold text-white">
                {correct}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4 rounded-xl bg-red-900/20 border border-red-700 p-5">

            <XCircle className="h-8 w-8 text-red-400" />

            <div>

              <p className="text-red-300 text-sm">
                Wrong Answers
              </p>

              <p className="text-3xl font-bold text-white">
                {wrong}
              </p>

            </div>

          </div>

        </div>

        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800 p-6 text-center">

          <h3 className="text-xl font-semibold text-white">
            {feedback.title}
          </h3>

          <p className="mt-2 text-slate-400">
            {feedback.message}
          </p>

        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">

          <button
            onClick={() => router.push("/student/dashboard")}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            <Home size={18} />
            Dashboard
          </button>

          <Link
            href="/student/classrooms"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            <RotateCcw size={18} />
            Back to Classrooms
          </Link>

        </div>

      </div>

    </div>
  );
}