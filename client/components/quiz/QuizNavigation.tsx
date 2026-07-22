"use client";

import { Card, CardContent } from "@/components/ui/card";

interface Question {
  id: number;
}

interface Props {
  totalQuestions: number;
  currentQuestion: number;
  answers: Record<number, string>;
  questions: Question[];
  onJump: (index: number) => void;
}

export default function QuizNavigation({
  totalQuestions,
  currentQuestion,
  answers,
  questions,
  onJump,
}: Props) {
  return (
    <Card className="sticky top-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Questions
        </h3>

        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const question = questions[index];

            const answered =
              question &&
              answers[question.id] !== undefined &&
              answers[question.id] !== "";

            return (
              <button
                key={index}
                onClick={() => onJump(index)}
                className={`h-10 w-10 rounded-lg border text-sm font-semibold transition-all
                  ${
                    currentQuestion === index
                      ? "bg-primary text-primary-foreground border-primary"
                      : answered
                      ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
                      : "hover:bg-muted"
                  }
                `}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-primary" />
            <span>Current Question</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-green-500" />
            <span>Answered</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border" />
            <span>Not Answered</span>
          </div>
        </div>

        <div className="mt-6 border-t pt-4 text-sm text-muted-foreground">
          Answered{" "}
          {
            questions.filter(
              (q) =>
                answers[q.id] !== undefined &&
                answers[q.id] !== ""
            ).length
          }{" "}
          / {totalQuestions}
        </div>
      </CardContent>
    </Card>
  );
}