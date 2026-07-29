"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Clock3,
  Brain,
  Sparkles,
} from "lucide-react";

import {
  getQuizById,
  startQuiz,
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

  const [attemptId, setAttemptId] =
    useState<number | null>(null);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      setLoading(true);

      const quizRes = await getQuizById(quizId);

      setQuiz(quizRes.quiz);

      const startRes = await startQuiz(quizId);

      setAttemptId(startRes.attemptId);

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
    if (attemptId === null) return;

    try {

      setLoading(true);

      const payload = {
        attemptId,
        answers: quiz.questions.map((q) => ({
          question_id: q.id,
          selected_option:
            (answers[q.id] as
              | "A"
              | "B"
              | "C"
              | "D") ?? null,
        })),
      };

      const res = await submitQuiz(
        quiz.id,
        payload
      );

      setResult(res.result);
      setSubmitted(true);

      toast.success(
        "Quiz submitted successfully"
      );

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
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="rounded-3xl border border-slate-800 bg-slate-900 px-10 py-8 shadow-2xl">

          <div className="flex flex-col items-center gap-6">

            <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-indigo-600 border-t-transparent" />

            <h2 className="text-xl font-semibold text-white">
              Loading Quiz...
            </h2>

          </div>

        </div>

      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-10 text-center">

          <h2 className="text-3xl font-bold text-red-400">
            Quiz not found
          </h2>

        </div>

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

  const answeredQuestions = Object.keys(answers).length;

  const progress =
    (answeredQuestions /
      quiz.questions.length) *
    100;

  return (

    <div className="grid gap-8 lg:grid-cols-4">

      <div className="space-y-6 lg:col-span-3">

        {/* Hero */}

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">

          <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-8">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div>

                <div className="mb-3 flex items-center gap-2 text-indigo-100">

                  <Brain className="h-5 w-5" />

                  <span className="font-medium">
                    Quiz in Progress
                  </span>

                </div>

                <h1 className="text-4xl font-bold text-white">
                  {quiz.title}
                </h1>

                <p className="mt-3 max-w-2xl text-indigo-100">
                  {quiz.description}
                </p>

              </div>

              <QuizTimer
                minutes={quiz.time_limit}
                onTimeUp={handleSubmit}
              />

            </div>

          </div>

          <div className="space-y-5 p-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2 text-white">

                <BookOpen className="h-5 w-5 text-indigo-400" />

                <span>
                  Question {currentQuestion + 1} of{" "}
                  {quiz.questions.length}
                </span>

              </div>

              <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-green-400">

                <Sparkles className="h-4 w-4" />

                {answeredQuestions} Answered

              </div>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>
                        {/* Question Card */}

            <QuestionCard
              question={
                quiz.questions[currentQuestion]
              }
              selectedAnswer={
                answers[
                  quiz.questions[currentQuestion].id
                ] ?? ""
              }
              questionNumber={
                currentQuestion + 1
              }
              totalQuestions={
                quiz.questions.length
              }
              onSelectAnswer={
                handleSelectAnswer
              }
            />

            {/* Navigation */}

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

              <div className="flex items-center justify-between">

                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={
                    currentQuestion === 0
                  }
                  className="rounded-xl px-6"
                >
                  ← Previous
                </Button>

                <div className="hidden text-sm text-slate-400 md:block">
                  Navigate through all questions before submitting.
                </div>

                {currentQuestion ===
                quiz.questions.length - 1 ? (

                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 transition-all duration-300 hover:scale-105"
                  >
                    ✅ Submit Quiz
                  </Button>

                ) : (

                  <Button
                    onClick={handleNext}
                    className="rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-8 transition-all duration-300 hover:scale-105"
                  >
                    Next →
                  </Button>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Sidebar */}

      <div className="space-y-6">

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

          <div className="mb-5 flex items-center gap-2">

            <Clock3 className="h-5 w-5 text-indigo-400" />

            <h2 className="text-lg font-bold text-white">
              Quiz Overview
            </h2>

          </div>

          <div className="space-y-4">

            <div className="flex items-center justify-between">

              <span className="text-slate-400">
                Total Questions
              </span>

              <span className="font-bold text-white">
                {quiz.questions.length}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-400">
                Answered
              </span>

              <span className="font-bold text-green-400">
                {answeredQuestions}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-slate-400">
                Remaining
              </span>

              <span className="font-bold text-orange-400">
                {quiz.questions.length -
                  answeredQuestions}
              </span>

            </div>

          </div>

        </div>

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