"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getQuizAnalytics } from "@/services/api/teacher.service";
import { TeacherQuizAnalytics } from "@/types/teacher";

import AnalyticsCard from "@/components/teacher/AnalyticsCard";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AnalyticsPage({
  params,
}: PageProps) {
  const [analytics, setAnalytics] =
    useState<TeacherQuizAnalytics | null>(null);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const { id } = await params;

        const response = await getQuizAnalytics(Number(id));

        setAnalytics(response);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-slate-400">
        Loading Analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-red-500">
        Analytics not found.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          {analytics.quiz.title}
        </h1>

        <p className="mt-2 text-slate-400">
          Quiz Analytics Dashboard
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnalyticsCard
          title="Total Students"
          value={analytics.summary.total_students}
        />

        <AnalyticsCard
          title="Submitted"
          value={analytics.summary.submitted}
        />

        <AnalyticsCard
          title="Pending"
          value={analytics.summary.pending}
        />

        <AnalyticsCard
          title="Average Score"
          value={analytics.summary.average_score}
        />

        <AnalyticsCard
          title="Highest Score"
          value={analytics.summary.highest_score}
        />

        <AnalyticsCard
          title="Lowest Score"
          value={analytics.summary.lowest_score}
        />
      </div>

      {/* Student Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-lg">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-slate-300">
                Student
              </th>

              <th className="px-6 py-4 text-left text-slate-300">
                Score
              </th>

              <th className="px-6 py-4 text-left text-slate-300">
                Status
              </th>

              <th className="px-6 py-4 text-left text-slate-300">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {analytics.students.map((student) => (
              <tr
                key={student.attempt_id}
                className="border-t border-slate-700"
              >
                <td className="px-6 py-4 text-white">
                  {student.username}
                </td>

                <td className="px-6 py-4 text-white">
                  {student.score}/{student.total_marks}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={
                      student.status === "SUBMITTED"
                        ? "font-semibold text-green-400"
                        : "font-semibold text-yellow-400"
                    }
                  >
                    {student.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      router.push(
                        `/teacher/quizzes/${analytics.quiz.id}/attempt/${student.attempt_id}`
                      )
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                  >
                    View Attempt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}