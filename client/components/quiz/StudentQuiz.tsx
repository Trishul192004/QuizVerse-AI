"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getQuizById,
  submitQuiz,
} from "@/services/api/studentQuiz.service";

import QuestionCard from "./QuestionCard";
import QuizNavigation from "./QuizNavigation";
import QuizTimer from "./QuizTimer";
import QuizResult from "./QuizResult";

import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  time_limit: number;
  questions: Question[];
}

interface Props {
  quizId: number;
}

export default function StudentQuiz({
  quizId,
}: Props) {
  const [loading, setLoading] = useState(true);

  const [quiz, setQuiz] =
    useState<Quiz | null>(null);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] =
    useState<Record<number, string>>({});

  const [submitted, setSubmitted] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);
      useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      setLoading(true);

      const res = await getQuizById(quizId);

      setQuiz(res.data);
    } catch (err: any) {
      console.error(err);

      toast.error(
        err.response?.data?.message ??
          "Failed to load quiz"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (
    questionId: number,
    answer: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (!quiz) return;

    if (
      currentQuestion <
      quiz.questions.length - 1
    ) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleJump = (index: number) => {
    setCurrentQuestion(index);
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      setLoading(true);

      const payload = {
        answers: quiz.questions.map((q) => ({
          questionId: q.id,
          answer: answers[q.id] ?? "",
        })),
      };

      const res = await submitQuiz(
        quiz.id,
        payload
      );

      setResult(res.data);

      setSubmitted(true);

      toast.success("Quiz submitted successfully");
    } catch (err: any) {
      console.error(err);

      toast.error(
        err.response?.data?.message ??
          "Failed to submit quiz"
      );
    } finally {
      setLoading(false);
    }
  };
    if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-medium">
          Loading Quiz...
        </p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">
          Quiz not found
        </h2>
      </div>
    );
  }

  if (submitted) {
    return (
      <QuizResult
        result={result}
        quiz={quiz}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

      <div className="lg:col-span-3 space-y-6">

        <div className="rounded-xl border bg-card p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold">
                {quiz.title}
              </h1>

              <p className="text-muted-foreground mt-2">
                {quiz.description}
              </p>
            </div>

            <QuizTimer
              minutes={quiz.time_limit}
              onTimeUp={handleSubmit}
            />

          </div>

        </div>

        <QuestionCard
          question={
            quiz.questions[currentQuestion]
          }
          selectedAnswer={
            answers[
              quiz.questions[currentQuestion].id
            ] ?? ""
          }
          questionNumber={currentQuestion + 1}
          totalQuestions={
            quiz.questions.length
          }
          onSelectAnswer={
            handleSelectAnswer
          }
        />
                <div className="flex items-center justify-between">

          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          {currentQuestion ===
          quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNext}
            >
              Next
            </Button>
          )}

        </div>

      </div>

      <div className="lg:col-span-1">

        <QuizNavigation
          totalQuestions={
            quiz.questions.length
          }
          currentQuestion={
            currentQuestion
          }
          answers={answers}
          questions={quiz.questions}
          onJump={handleJump}
        />

      </div>

    </div>
  );
}