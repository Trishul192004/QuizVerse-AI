"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AIQuizDialog from "@/components/quiz/AIQuizDialog";

import CreateQuizDialog from "@/components/quiz/CreateQuizDialog";

import {
  getClassroom,
  getClassroomQuizzes,
  ClassroomDetails,
  Quiz,
} from "@/services/api/classroom.service";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ClassroomDetailsPage({
  params,
}: PageProps) {
  const [classroomId, setClassroomId] =
    useState(0);

  const [classroom, setClassroom] =
    useState<ClassroomDetails | null>(null);

  const [quizzes, setQuizzes] =
    useState<Quiz[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const { id } = await params;

      const parsedId = Number(id);

      setClassroomId(parsedId);

      const classroomRes =
        await getClassroom(parsedId);

      setClassroom(classroomRes.classroom);

      const quizRes =
        await getClassroomQuizzes(parsedId);

      setQuizzes(quizRes.quizzes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="p-8 text-lg">
        Loading...
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="p-8 text-lg">
        Classroom not found.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">
          {classroom.name}
        </h1>

        <p className="mt-2 text-slate-500">
          Manage quizzes for this classroom
        </p>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        <div className="rounded-xl border p-6">

          <p className="text-sm text-slate-500">
            Join Code
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {classroom.join_code}
          </h2>

        </div>

        <div className="rounded-xl border p-6">

          <p className="text-sm text-slate-500">
            Students
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {classroom.students}
          </h2>

        </div>

        <div className="rounded-xl border p-6">

          <p className="text-sm text-slate-500">
            Created
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            {new Date(
              classroom.created_at
            ).toLocaleDateString()}
          </h2>

        </div>

      </div>

      {/* Quiz Header */}

      <div className="flex items-center justify-between">

        <h2 className="text-3xl font-bold">
          Quizzes
        </h2>

        <div className="flex gap-2">

      <div className="flex gap-2">
        <CreateQuizDialog
        classroomId={classroomId}
        onSuccess={loadData}
        />  


    </div>

      <AIQuizDialog classroomId={classroomId} onSuccess={loadData} />

      </div>

      </div>

      {/* Quiz List */}

      {quizzes.length === 0 ? (

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
          No quizzes created yet.
        </div>

      ) : (

        <div className="space-y-4">

          {quizzes.map((quiz) => (

            <Link
              key={quiz.id}
              href={`/teacher/quizzes/${quiz.id}`}
            >

              <div
                className="
                  cursor-pointer
                  rounded-xl
                  border
                  p-6
                  transition-all
                  hover:border-violet-500
                  hover:shadow-lg
                "
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h3 className="text-xl font-bold">
                      {quiz.title}
                    </h3>

                    <p className="mt-2 text-slate-600">
                      {quiz.description}
                    </p>

                  </div>

                </div>

                <div className="mt-5 flex flex-wrap gap-6 text-sm">

                  <span>
                    ⏱ {quiz.time_limit} mins
                  </span>

                  <span>
                    📝 {quiz.total_marks} Marks
                  </span>

                  <span>
                    📅{" "}
                    {new Date(
                      quiz.created_at
                    ).toLocaleDateString()}
                  </span>

                </div>

              </div>

            </Link>

          ))}

        </div>

      )}

    </div>
  );
}