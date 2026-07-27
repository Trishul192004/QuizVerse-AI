"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Clock } from "lucide-react";
import {
  StudentQuiz,
  startQuiz,
} from "@/services/api/student-rag.service";
import { useRouter } from "next/navigation";

interface Props {
  quiz: StudentQuiz;
}

export default function AIStudyCard({ quiz }: Props) {
  const router = useRouter();

  const handleStartQuiz = async () => {
    try {
      const response = await startQuiz(quiz.id);

      router.push(`/student/attempt/${response.attemptId}`);
    } catch (error) {
      console.error("Failed to start quiz:", error);
    }
  };

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{quiz.title}</h2>

        <p className="text-sm text-muted-foreground">
          Classroom: {quiz.classroom_name}
        </p>

        <div className="flex gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {quiz.question_count} Questions
          </span>

          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {quiz.time_limit} mins
          </span>
        </div>
      </div>

      <Button className="mt-5 w-full" onClick={handleStartQuiz}>
        Start Quiz
      </Button>
    </div>
  );
}