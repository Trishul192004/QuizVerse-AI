"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { toast } from "sonner";

import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Flag,
} from "lucide-react";

import {
  getAttemptQuiz,
  submitQuiz,
  AttemptQuiz,
  QuizQuestion,
} from "@/services/api/student.service";

export default function AttemptQuizPage() {

  const params = useParams();
  const router = useRouter();

  const attemptId = Number(params.attemptId);

  const [quiz, setQuiz] =
    useState<AttemptQuiz | null>(null);

  const [questions, setQuestions] =
    useState<QuizQuestion[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] =
    useState<Record<number, string>>({});

  const [secondsLeft, setSecondsLeft] =
    useState(0);

  const [submitting, setSubmitting] =
    useState(false);

  /*
  =====================================
  Prevent duplicate submit
  =====================================
  */

  const hasSubmitted = useRef(false);

  /*
  =====================================
  Load Quiz
  =====================================
  */

  useEffect(() => {

    const loadQuiz = async () => {

      try {

        const response =
          await getAttemptQuiz(attemptId);

        setQuiz(response.quiz);

        setQuestions(response.questions);

        setSecondsLeft(
          response.quiz.time_limit * 60
        );

      } catch (error: any) {

        console.error(error);

        toast.error(
          error?.response?.data?.message ??
          "Failed to load quiz."
        );

      } finally {

        setLoading(false);

      }

    };

    if (attemptId) {

      loadQuiz();

    }

  }, [attemptId]);

  /*
  =====================================
  Timer
  =====================================
  */

  useEffect(() => {

    if (!quiz) return;

    if (loading) return;

    if (submitting) return;

    if (hasSubmitted.current) return;

    if (secondsLeft <= 0) {

      handleSubmit();

      return;

    }

    const timer = window.setTimeout(() => {

      setSecondsLeft(prev => prev - 1);

    }, 1000);

    return () => window.clearTimeout(timer);

  }, [
    secondsLeft,
    quiz,
    loading,
    submitting,
  ]);

  /*
  =====================================
  Format Timer
  =====================================
  */

  const formattedTime = useMemo(() => {

    const mins =
      Math.floor(secondsLeft / 60);

    const secs =
      secondsLeft % 60;

    return `${mins
      .toString()
      .padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;

  }, [secondsLeft]);

  /*
  =====================================
  Select Answer
  =====================================
  */

  const handleAnswerSelect = (
    questionId: number,
    option: string
  ) => {

    if (submitting) return;

    setAnswers(prev => ({
      ...prev,
      [questionId]: option,
    }));

  };
    /*
  =====================================
  Submit Quiz
  =====================================
  */

  const handleSubmit = async () => {

    /*
    Prevent duplicate submissions
    */

    if (submitting || hasSubmitted.current) {
      return;
    }

    hasSubmitted.current = true;

    setSubmitting(true);

    try {

      const payload = questions.map(question => ({
        question_id: question.id,
        selected_option: answers[question.id] ?? "",
      }));

      const response = await submitQuiz(
        attemptId,
        payload
      );

      /*
      Stop timer permanently
      */

      setSecondsLeft(-1);

      toast.success(
        "Quiz submitted successfully!"
      );

      router.replace(
        `/student/result/${attemptId}?score=${response.score}&total=${response.total_marks}&correct=${response.correct}&wrong=${response.wrong}`
      );

    } catch (error: any) {

      /*
      Allow retry only if submit failed
      */

      hasSubmitted.current = false;

      setSubmitting(false);

      console.error(error);

      toast.error(
        error?.response?.data?.message ??
        "Failed to submit quiz."
      );

    }

  };

  /*
  =====================================
  Loading
  =====================================
  */

  if (loading) {

    return (

      <div className="flex h-screen items-center justify-center text-white">

        Loading Quiz...

      </div>

    );

  }

  /*
  =====================================
  Empty Quiz Protection
  =====================================
  */

  if (!quiz || questions.length === 0) {

    return (

      <div className="flex h-screen items-center justify-center">

        <div className="rounded-xl border border-red-700 bg-slate-900 p-8 text-center">

          <h2 className="text-2xl font-bold text-white">

            Quiz not available

          </h2>

          <p className="mt-3 text-slate-400">

            This quiz doesn't contain any questions.

          </p>

        </div>

      </div>

    );

  }

  const question =
    questions[currentQuestion];

  return (

    <div className="mx-auto max-w-5xl space-y-8 p-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-white">

            {quiz.title}

          </h1>

          <p className="mt-2 text-slate-400">

            Question {currentQuestion + 1} of {questions.length}

          </p>

        </div>

        <div
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-red-600
            px-5
            py-3
            text-lg
            font-bold
            text-white
          "
        >

          <Clock size={20} />

          {formattedTime}

        </div>

      </div>

      {/* Progress */}

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full bg-violet-600 transition-all"
          style={{
            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
          }}
        />

      </div>

      {/* Question Card */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

        <h2 className="text-2xl font-semibold text-white">

          {question.question}

        </h2>

        <div className="mt-8 grid gap-4">

          {[
            ["A", question.option_a],
            ["B", question.option_b],
            ["C", question.option_c],
            ["D", question.option_d],
          ].map(([key, value]) => (

                      {[
            ["A", question.option_a],
            ["B", question.option_b],
            ["C", question.option_c],
            ["D", question.option_d],
            ].map(([key, value]) => (

            <button
              key={key}
              disabled={submitting}
              onClick={() =>
                handleAnswerSelect(
                  question.id,
                  key
                )
              }
              className={`
                rounded-xl
                border
                p-5
                text-left
                transition-all

                ${
                  answers[question.id] === key
                    ? "border-violet-500 bg-violet-700 text-white"
                    : "border-slate-700 bg-slate-800 text-slate-200 hover:border-violet-500"
                }

                ${
                  submitting
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }
              `}
            >

              <span className="font-bold">

                {key}.

              </span>{" "}

              {value}

            </button>

          ))}

          </div>

      </div>

      {/* Navigation */}

      <div className="flex items-center justify-between">

        <button
          disabled={
            currentQuestion === 0 ||
            submitting
          }
          onClick={() =>
            setCurrentQuestion(prev =>
              Math.max(prev - 1, 0)
            )
          }
          className="
            flex
            items-center
            gap-2
            rounded-lg
            border
            border-slate-700
            px-5
            py-3
            text-white
            transition
            hover:bg-slate-800
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          <ArrowLeft size={18} />

          Previous

        </button>

        {currentQuestion === questions.length - 1 ? (

          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-green-600
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-green-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            <Flag size={18} />

            {submitting
              ? "Submitting..."
              : "Submit Quiz"}

          </button>

        ) : (

          <button
            disabled={submitting}
            onClick={() =>
              setCurrentQuestion(prev =>
                Math.min(
                  prev + 1,
                  questions.length - 1
                )
              )
            }
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-violet-600
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-violet-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            Next

            <ArrowRight size={18} />

          </button>

        )}

      </div>

    </div>

  );

}