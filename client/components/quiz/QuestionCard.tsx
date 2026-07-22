"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface Props {
  question: Question;
  selectedAnswer: string;
  questionNumber: number;
  totalQuestions: number;
  onSelectAnswer: (
    questionId: number,
    answer: "A" | "B" | "C" | "D"
  ) => void;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  questionNumber,
  totalQuestions,
  onSelectAnswer,
}: Props) {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </p>

          <h2 className="text-2xl font-semibold mt-2">
            {question.question}
          </h2>
        </div>

        <div className="space-y-4">
          {question.options.map((option, index) => {
            const optionLetter = String.fromCharCode(
              65 + index
            ) as "A" | "B" | "C" | "D";

            return (
              <label
                key={index}
                className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all ${
                  selectedAnswer === optionLetter
                    ? "border-primary bg-primary/10"
                    : "hover:bg-muted"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={selectedAnswer === optionLetter}
                  onChange={() =>
                    onSelectAnswer(
                      question.id,
                      optionLetter
                    )
                  }
                  className="h-4 w-4"
                />

                <div>
                  <Label className="font-medium cursor-pointer">
                    {optionLetter}.
                  </Label>

                  <p>{option}</p>
                </div>
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}