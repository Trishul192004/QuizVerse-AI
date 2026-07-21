"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getAttemptDetails } from "@/services/api/attempt.service";
import { AttemptResponse } from "@/types/attempt";

interface PageProps {
  params: Promise<{
    id: string;
    attemptId: string;
  }>;
}

export default function AttemptPage({
  params,
}: PageProps) {
  const [data, setData] = useState<AttemptResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttempt = async () => {
      try {
        const { attemptId } = await params;

        const response = await getAttemptDetails(Number(attemptId));

        setData(response);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load attempt.");
      } finally {
        setLoading(false);
      }
    };

    loadAttempt();
  }, [params]);

  if (loading) {
    return (
      <div className="p-8 text-white">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-red-500">
        No Attempt Found
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          {data.attempt.username}
        </h1>

        <p className="text-slate-400">
          {data.attempt.title}
        </p>

        <p className="mt-2 text-xl text-green-400">
          Score {data.attempt.score} / {data.attempt.total_marks}
        </p>
      </div>

      {data.questions.map((question) => (
        <div
          key={question.id}
          className="rounded-xl border border-slate-700 bg-slate-900 p-6"
        >
          <h2 className="text-xl font-bold text-white">
            {question.question}
          </h2>

          <div className="mt-6 space-y-3">
            <p className="text-white">
              Student Answer:
              <span className="ml-2 font-semibold text-yellow-400">
                {question.selected_option}
              </span>
            </p>

            <p className="text-white">
              Correct Answer:
              <span className="ml-2 font-semibold text-green-400">
                {question.correct_option}
              </span>
            </p>

            <p className="text-white">
              Marks:
              <span className="ml-2 font-semibold text-blue-400">
                {question.marks_awarded} / {question.marks}
              </span>
            </p>

            {question.explanation && (
              <p className="text-slate-400">
                {question.explanation}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}