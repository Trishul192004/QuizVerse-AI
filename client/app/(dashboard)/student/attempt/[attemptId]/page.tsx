"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Flag,
  Check,
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

  /*
  =====================================
  STATE
  =====================================
  */

  const [quiz, setQuiz] = useState<AttemptQuiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] =
    useState<Record<number, string>>({});

  const [secondsLeft, setSecondsLeft] = useState(0);

  const [showSubmitDialog, setShowSubmitDialog] =
    useState(false);

  const hasSubmitted = useRef(false);

  /*
  =====================================
  LOAD QUIZ
  =====================================
  */

  useEffect(() => {
     const loadQuiz = async () => {
      try {
        const response = await getAttemptQuiz(attemptId);

        setQuiz(response.attempt);
        setQuestions(response.questions);

        setSecondsLeft(
          response.attempt.time_limit * 60
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
  TIMER
  =====================================
  */

  useEffect(() => {
    if (!quiz) return;
    if (loading) return;
    if (submitting) return;
    if (hasSubmitted.current) return;


    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    secondsLeft,
    quiz,
    loading,
    submitting,
  ]);

  /*
  =====================================
  KEYBOARD SHORTCUTS
  =====================================
  */

  useEffect(() => {
    const question = questions[currentQuestion];

    if (!question) return;

    const listener = (e: KeyboardEvent) => {
      if (submitting) return;

      switch (e.key.toLowerCase()) {
        case "a":
          handleAnswerSelect(question.id, "A");
          break;

        case "b":
          handleAnswerSelect(question.id, "B");
          break;

        case "c":
          handleAnswerSelect(question.id, "C");
          break;

        case "d":
          handleAnswerSelect(question.id, "D");
          break;

        case "arrowleft":
          setCurrentQuestion((prev) =>
            Math.max(prev - 1, 0)
          );
          break;

        case "arrowright":
          setCurrentQuestion((prev) =>
            Math.min(
              prev + 1,
              questions.length - 1
            )
          );
          break;
      }
    };

    window.addEventListener("keydown", listener);

    return () =>
      window.removeEventListener(
        "keydown",
        listener
      );
  }, [
    currentQuestion,
    questions,
    submitting,
  ]);

  /*
  =====================================
  HELPERS
  =====================================
  */

  const answeredCount = Object.keys(answers).length;

  const formattedTime = useMemo(() => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;

    return `${mins
      .toString()
      .padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
    }, [secondsLeft]);

  const handleAnswerSelect = (
    questionId: number,
    option: string
    ) => {
    if (submitting) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
      }));
  };

  /*
  =====================================
  SUBMIT QUIZ
  =====================================
   */

    const handleSubmit = async () => {
    if (submitting || hasSubmitted.current) return;

    const unanswered = questions.filter(
      (q) => !answers[q.id]
    );

    if (
      unanswered.length > 0 &&
      !showSubmitDialog
    ) {
      setShowSubmitDialog(true);
      return;
    }

    hasSubmitted.current = true;
     setSubmitting(true);
    setShowSubmitDialog(false);

    try {
      const payload = questions.map((question) => ({
        question_id: question.id,
        selected_option:
          answers[question.id] ?? "",
      }));

      const response = await submitQuiz(
        attemptId,
        payload
       );

      setSecondsLeft(-1);

      toast.success(
        "Quiz submitted successfully!"
      );

      router.replace(
        `/student/result/${attemptId}?score=${response.score}&total=${response.total_marks}&correct=${response.correct}&wrong=${response.wrong}`
      );
      } catch (error: any) {
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
  LOADING
  =====================================
  */

   if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-xl border bg-slate-900 px-10 py-8 text-center shadow-lg">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent mx-auto" />
          <h2 className="text-xl font-semibold text-white">
            Loading Quiz...
          </h2>
          <p className="mt-2 text-slate-400">
            Please wait while we prepare your
            questions.
          </p>
        </div>
      </div>
     );
  }

  /*
  =====================================
  EMPTY QUIZ
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
            This quiz doesn't contain any
            questions.
          </p>
          </div>
      </div>
     );
  }

  /*
  =====================================
  HELPER VARIABLES
  =====================================
  */

  const question =
    questions[currentQuestion];

  const progress =
      (answeredCount / questions.length) * 100
    

  const unansweredCount =
    questions.length - answeredCount;

return (
  <>
    <div className="mx-auto max-w-6xl space-y-8 p-8">

      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-white">
            {quiz.title}
          </h1>

          <p className="mt-2 text-slate-400">
            Question {currentQuestion + 1} of {questions.length}
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">

            <span className="rounded-full bg-green-600 px-3 py-1 text-white">
              Answered: {answeredCount}
            </span>

            <span className="rounded-full bg-orange-600 px-3 py-1 text-white">
              Remaining: {unansweredCount}
            </span>

            <span className="rounded-full bg-slate-700 px-3 py-1 text-white">
              Total: {questions.length}
            </span>

          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-red-600 px-6 py-4 text-xl font-bold text-white shadow-lg">

          <Clock size={22} />

          {formattedTime}

        </div>

      </div>

      {/* Progress */}

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full bg-violet-600 transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      {/* Question Palette */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="mb-4 flex items-center justify-between">

          <h2 className="text-lg font-semibold text-white">
            Question Palette
          </h2>

          <span className="text-sm text-slate-400">
            Click any question to jump
          </span>

        </div>

        <div className="flex flex-wrap gap-3">

          {questions.map((q, index) => {

            const answered = !!answers[q.id];
            const active = currentQuestion === index;

            return (
              <button
                key={q.id}
                onClick={() =>
                  setCurrentQuestion(index)
                }
                className={`h-11 w-11 rounded-lg font-semibold transition

                ${
                  active
                    ? "bg-violet-600 text-white ring-2 ring-violet-300"
                    : answered
                    ? "bg-green-600 text-white"
                    : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                }
              `}
              >
                  <div className="relative flex h-full w-full items-center justify-center">

                    {index + 1}

                    {answered && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-green-600">
                        ✓
                      </span>
                    )}

                  </div>
              </button>
            );

          })}

        </div>

      </div>

      {/* Question */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

        <div className="mb-8 flex items-start justify-between">

          <h2 className="text-2xl font-semibold leading-relaxed text-white">

            Q{currentQuestion + 1}. {question.question}

          </h2>

          <span className="ml-5 rounded-lg bg-violet-700 px-3 py-2 text-sm text-white">

            {question.marks} Marks

          </span>

        </div>

        <div className="grid gap-5">

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
              className={`rounded-xl border p-5 text-left transition-all duration-200

              ${
                answers[question.id] === key
                  ? "border-violet-500 bg-violet-700 text-white shadow-lg"
                  : "border-slate-700 bg-slate-800 text-slate-200 hover:border-violet-500 hover:bg-slate-700"
              }

              ${
                submitting
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }
            `}
            >

              <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 font-bold">

                {key}

              </span>

              {value}

            </button>

          ))}

        </div>

       </div>


             {/* Navigation */}

      <div className="flex items-center justify-between">

        <button
          disabled={currentQuestion === 0 || submitting}
          onClick={() =>
            setCurrentQuestion((prev) =>
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
            bg-slate-900
            px-6
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
            onClick={() => setShowSubmitDialog(true)}
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
              setCurrentQuestion((prev) =>
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

    {/* Submit Confirmation Dialog */}

    {showSubmitDialog && (

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

        <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">

          <h2 className="text-2xl font-bold text-white">
            Submit Quiz?
          </h2>

          <p className="mt-4 text-slate-300">
            Answered:
            <span className="ml-2 font-semibold text-green-400">
              {answeredCount}
            </span>

            {" / "}

            {questions.length}
          </p>

          {unansweredCount > 0 && (

            <p className="mt-2 text-orange-400">
              You still have{" "}
              <strong>
                {unansweredCount}
              </strong>{" "}
              unanswered question
              {unansweredCount > 1 ? "s" : ""}.
            </p>

          )}

          <div className="mt-8 flex justify-end gap-3">

            <button
              onClick={() =>
                setShowSubmitDialog(false)
              }
              className="rounded-lg border border-slate-600 px-5 py-2 text-white hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"
            >
              Submit
            </button>

          </div>

        </div>

      </div>

    )}

    {/* Submission Overlay */}

    {submitting && (

      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">

        <div className="rounded-2xl bg-slate-900 p-10 text-center shadow-2xl">

          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />

          <h2 className="text-2xl font-bold text-white">
            Submitting Quiz...
          </h2>

          <p className="mt-3 text-slate-400">
            Please wait.
          </p>

          <p className="text-slate-500">
            Do not close or refresh this page.
          </p>

        </div>

      </div>

    )}

  </>
);
}