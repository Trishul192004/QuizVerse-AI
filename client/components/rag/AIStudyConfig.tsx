"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { generateAIQuiz } from "@/services/api/quiz-generation.service";
import { publishQuiz } from "@/services/api/quiz.service";
interface AIStudyConfigProps {
  classroomId: number;
  documentId: number | null;
}

export default function AIStudyConfig({
  classroomId,
  documentId,
}: AIStudyConfigProps) {
  const [questionType, setQuestionType] = useState("mcq");
  const [difficulty, setDifficulty] = useState("medium");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(30);
  const [loading, setLoading] = useState(false);

  const [generatedQuiz, setGeneratedQuiz] =
    useState<any>(null);

  const handleGenerateQuiz = async () => {
    if (!documentId) {
      toast.error("Please select a document.");
      return;
    }

    try {
      setLoading(true);

      const result = await generateAIQuiz({
        classroomId,
        documentId,
        questionType,
        difficulty,
        numberOfQuestions,
        timeLimit,
      });

      setGeneratedQuiz(result);

      toast.success(
        "AI Quiz generated successfully."
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to generate AI quiz."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-6 space-y-6">

      <div>
        <h2 className="text-2xl font-bold">
          AI Study Configuration
        </h2>

        <p className="text-gray-500 mt-1">
          Configure how AI should generate the quiz.
        </p>
      </div>

      {/* Question Type */}

      <div>
        <label className="block mb-2 font-medium">
          Question Type
        </label>

        <select
          className="w-full rounded-lg border p-2"
          value={questionType}
          onChange={(e) =>
            setQuestionType(e.target.value)
          }
        >
          <option value="mcq">
            Multiple Choice
          </option>

          <option value="descriptive">
            Descriptive
          </option>

          <option value="mixed">
            Mixed
          </option>
        </select>
      </div>

      {/* Difficulty */}

      <div>
        <label className="block mb-2 font-medium">
          Difficulty
        </label>

        <select
          className="w-full rounded-lg border p-2"
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value)
          }
        >
          <option value="easy">
            Easy
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="hard">
            Hard
          </option>
        </select>
      </div>

      {/* Number of Questions */}

      <div>
        <label className="block mb-2 font-medium">
          Number of Questions
        </label>

        <input
          type="number"
          min={1}
          max={50}
          className="w-full rounded-lg border p-2"
          value={numberOfQuestions}
          onChange={(e) =>
            setNumberOfQuestions(
              Number(e.target.value)
            )
          }
        />
      </div>

      {/* Time Limit */}

      <div>
        <label className="block mb-2 font-medium">
          Time Limit (minutes)
        </label>

        <input
          type="number"
          min={5}
          max={180}
          className="w-full rounded-lg border p-2"
          value={timeLimit}
          onChange={(e) =>
            setTimeLimit(
              Number(e.target.value)
            )
          }
        />
      </div>

      <Button
        className="w-full"
        disabled={loading}
        onClick={handleGenerateQuiz}
      >
        {loading
          ? "Generating Quiz..."
          : "Generate AI Quiz"}
      </Button>

      {generatedQuiz &&
        generatedQuiz.questions &&
        generatedQuiz.questions.length > 0 && (

          <div className="mt-8 space-y-6">

            <div>

              <h2 className="text-2xl font-bold">
                Generated Quiz
              </h2>

              <p className="text-slate-500">
                Review and edit before publishing.
              </p>

            </div>

            {generatedQuiz.questions.map(
              (
                question: any,
                index: number
              ) => (

                <div
                  key={index}
                  className="rounded-xl border bg-slate-50 p-5"
                >

                  <input
                    className="w-full rounded-lg border p-3 text-lg font-semibold"
                    value={question.question}
                    onChange={(e) => {

                      const updated =
                        structuredClone(
                          generatedQuiz
                        );

                      updated.questions[index].question =
                        e.target.value;

                      setGeneratedQuiz(updated);

                    }}
                  />

                  <div className="mt-5 space-y-3">
                    {question.options.map(
  (
    option: string,
    optionIndex: number
  ) => (

    <div
      key={optionIndex}
      className={`rounded-lg border p-3 ${
        question.correctOption ===
        String.fromCharCode(
          65 + optionIndex
        )
          ? "border-green-500 bg-green-50"
          : ""
      }`}
    >

      <div className="flex items-center gap-3">

        <strong>
          {String.fromCharCode(
            65 + optionIndex
          )}
          .
        </strong>

        <input
          className="flex-1 rounded border p-2"
          value={option}
          onChange={(e) => {

            const updated =
              structuredClone(
                generatedQuiz
              );

            updated.questions[index]
              .options[optionIndex] =
              e.target.value;

            setGeneratedQuiz(updated);

          }}
        />

      </div>

    </div>

  )
)}

</div>

<div className="mt-5">

  <label className="font-medium">
    Explanation
  </label>

  <textarea
    rows={3}
    className="mt-2 w-full rounded-lg border p-3"
    value={question.explanation}
    onChange={(e) => {

      const updated =
        structuredClone(
          generatedQuiz
        );

      updated.questions[index]
        .explanation =
        e.target.value;

      setGeneratedQuiz(updated);

    }}
  />

</div>

<div className="mt-5 flex justify-between">

  <Button
    variant="destructive"
    onClick={() => {

      const updated =
        structuredClone(
          generatedQuiz
        );

      updated.questions.splice(
        index,
        1
      );

      setGeneratedQuiz(updated);

    }}
  >
    Delete Question
  </Button>

</div>

</div>

)
)}

<div className="pt-6">

  <Button
    className="w-full"
onClick={async () => {

    await publishQuiz(
        generatedQuiz.quizId
    );

    toast.success(
        "Quiz Published Successfully!"
    );

}}
  >
    Publish Quiz
  </Button>

</div>

</div>

)}

</div>

);

}