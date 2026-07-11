"use client";

import { useEffect, useState } from "react";

import AddQuestionDialog from "@/components/question/AddQuestionDialog";
import QuestionCard from "@/components/question/QuestionCard";

import {
  Question,
  getQuestionsByQuiz,
  deleteQuestion,
} from "@/services/api/question.service";

import { toast } from "sonner";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function QuizDetailsPage({
  params,
}: PageProps) {

  const [quizId, setQuizId] =
    useState(0);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [loading, setLoading] =
    useState(true);

  /*
  ============================================
  LOAD QUESTIONS
  ============================================
  */

  const loadQuestions = async () => {

    try {

      setLoading(true);

      const { id } = await params;

      const parsedId = Number(id);

      setQuizId(parsedId);

      const response =
        await getQuestionsByQuiz(parsedId);

      setQuestions(response.questions);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load questions"
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadQuestions();

  }, [params]);

  /*
  ============================================
  DELETE
  ============================================
  */

  const handleDelete =
    async (id: number) => {

      if (
        !confirm(
          "Delete this question?"
        )
      ) {
        return;
      }

      try {

        await deleteQuestion(id);

        toast.success(
          "Question deleted"
        );

        loadQuestions();

      } catch (error) {

        console.error(error);

        toast.error(
          "Delete failed"
        );

      }

    };

  /*
  ============================================
  EDIT
  ============================================
  */

  const handleEdit = (
    question: Question
  ) => {

    console.log(question);

    toast.info(
      "Edit dialog coming next"
    );

  };

  /*
  ============================================
  LOADING
  ============================================
  */

  if (loading) {

    return (

      <div className="p-8">

        Loading...

      </div>

    );

  }

  /*
  ============================================
  UI
  ============================================
  */

  return (

    <div className="space-y-8 p-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Question Management
          </h1>

          <p className="mt-2 text-slate-500">
            Manage all questions for this quiz.
          </p>

        </div>

        <AddQuestionDialog
          quizId={quizId}
          onSuccess={loadQuestions}
        />

      </div>

      {
        questions.length === 0
        ? (

          <div
            className="
              rounded-xl
              border
              border-dashed
              p-10
              text-center
              text-slate-500
            "
          >

            No questions added yet.

          </div>

        )
        : (

          <div className="space-y-6">

            {
              questions.map((question) => (

                <QuestionCard
                  key={question.id}
                  question={question}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />

              ))
            }

          </div>

        )
      }

    </div>

  );

}