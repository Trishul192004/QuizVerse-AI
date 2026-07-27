"use client";

import { useEffect, useState } from "react";
import AIStudyCard from "@/components/student/AIStudyCard";
import {
  getPublishedQuizzes,
  StudentQuiz,
} from "@/services/api/student-rag.service";

export default function StudentRagPage() {
  const [quizzes, setQuizzes] = useState<StudentQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getPublishedQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">AI Study</h1>
        <p>Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">AI Study</h1>

      {quizzes.length === 0 ? (
        <div className="rounded-lg border p-10 text-center">
          <h2 className="text-xl font-semibold">No AI Study quizzes available</h2>
          <p className="mt-2 text-muted-foreground">
            Your teacher hasn't published any AI Study quizzes yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <AIStudyCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}