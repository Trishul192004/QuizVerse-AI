
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface Props {
  result: any;
  quiz: any;
}

export default function QuizResult({
  result,
  quiz,
}: Props) {
  const score = result?.score ?? 0;
  const total =
    result?.totalQuestions ??
    quiz?.questions?.length ??
    0;

  const percentage =
    total > 0
      ? Math.round((score / total) * 100)
      : 0;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card className="shadow-xl">
        <CardContent className="p-10">

          <div className="flex flex-col items-center">

            <Trophy className="h-20 w-20 text-yellow-500" />

            <h1 className="text-4xl font-bold mt-6">
              Quiz Completed!
            </h1>

            <p className="text-muted-foreground mt-2">
              {quiz.title}
            </p>

            <div className="mt-10 flex h-40 w-40 items-center justify-center rounded-full border-8 border-primary">
              <div className="text-center">
                <p className="text-5xl font-bold">
                  {percentage}%
                </p>

                <p className="text-sm text-muted-foreground">
                  Score
                </p>
              </div>
            </div>

          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">

            <div className="rounded-xl border p-6 text-center">
              <CheckCircle className="mx-auto h-10 w-10 text-green-500" />

              <p className="mt-3 text-2xl font-bold">
                {score}
              </p>

              <p className="text-muted-foreground">
                Correct
              </p>
            </div>

            <div className="rounded-xl border p-6 text-center">
              <XCircle className="mx-auto h-10 w-10 text-red-500" />

              <p className="mt-3 text-2xl font-bold">
                {total - score}
              </p>

              <p className="text-muted-foreground">
                Wrong
              </p>
            </div>

            <div className="rounded-xl border p-6 text-center">
              <Clock className="mx-auto h-10 w-10 text-blue-500" />

              <p className="mt-3 text-2xl font-bold">
                {result?.timeTaken ?? "--"}
              </p>

              <p className="text-muted-foreground">
                Time
              </p>
            </div>

          </div>

          <div className="mt-10 rounded-xl bg-muted p-6 text-center">

            <p className="text-lg font-medium">
              Final Score
            </p>

            <h2 className="mt-2 text-5xl font-bold">
              {score} / {total}
            </h2>

            <p className="mt-3 text-muted-foreground">
              Great job! Keep practicing to improve your score.
            </p>

          </div>

          <div className="mt-8 flex justify-center gap-4">

            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry Quiz
            </Button>

            <Button
              onClick={() => (window.location.href = "/student")}
            >
              Back to Dashboard
            </Button>

          </div>

        </CardContent>
      </Card>
    </div>
  );
}