"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import AddQuestionDialog from "@/components/question/AddQuestionDialog";
import EditQuestionDialog from "@/components/question/EditQuestionDialog";
import DeleteQuestionDialog from "@/components/question/DeleteQuestionDialog";
import QuestionCard from "@/components/question/QuestionCard";

import {
  Question,
  getQuestionsByQuiz,
  deleteQuestion,
} from "@/services/api/question.service";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function QuizDetailsPage({
  params,
}: PageProps) {
  const [quizId, setQuizId] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  /*
  ==========================================
  LOAD QUESTIONS
  ==========================================
  */
  const loadQuestions = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      const { id } = await params;
      const parsedId = Number(id);
      setQuizId(parsedId);

      const response = await getQuestionsByQuiz(parsedId);
      setQuestions(response.questions);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load questions.");
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [params]);

  /*
  ==========================================
  EDIT QUESTION
  ==========================================
  */
  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setEditOpen(true);
  };

  /*
  ==========================================
  DELETE QUESTION
  ==========================================
  */
  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  /*
  ==========================================
  CONFIRM DELETE
  ==========================================
  */
  const confirmDelete = async () => {
    if (deleteId === null) return;

    try {
      await deleteQuestion(deleteId);
      toast.success("Question deleted successfully.");
      await loadQuestions(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete question.");
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  /*
  ==========================================
  LOADING
  ==========================================
  */
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
          <p className="text-sm font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  /*
  ==========================================
  PAGE
  ==========================================
  */
  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Question Management
          </h1>
          <p className="mt-2 text-slate-400">
            Add, edit and delete questions for this quiz.
          </p>
        </div>

        <AddQuestionDialog
          quizId={quizId}
          onSuccess={() => loadQuestions(true)}
        />
      </div>

      {/* Questions */}
      {questions.length === 0 ? (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-slate-700
            bg-slate-900/50
            p-16
            text-center
            text-slate-400
            shadow-md
          "
        >
          <p className="text-lg font-medium text-slate-300">No questions have been added yet.</p>
          <p className="text-sm text-slate-500 mt-1">Click the "Add Question" button to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <EditQuestionDialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedQuestion(null);
        }}
        question={selectedQuestion}
        onSuccess={() => loadQuestions(true)}
      />

      {/* Delete Dialog */}
      <DeleteQuestionDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}