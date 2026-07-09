"use client";

import { useEffect, useState } from "react";

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
  const [classroom, setClassroom] =
    useState<ClassroomDetails | null>(null);

  const [quizzes, setQuizzes] =
    useState<Quiz[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { id } = await params;

        const classroomRes =
          await getClassroom(Number(id));

        setClassroom(
          classroomRes.classroom
        );

        const quizRes =
          await getClassroomQuizzes(
            Number(id)
          );

        setQuizzes(
          quizRes.quizzes
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="p-8">
        Classroom not found.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">

      <div>

        <h1 className="text-4xl font-bold">
          {classroom.name}
        </h1>

      </div>

      <div className="grid grid-cols-3 gap-6">

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

      <div className="flex items-center justify-between">

        <h2 className="text-3xl font-bold">
          Quizzes
        </h2>

        <button
          className="
            rounded-lg
            bg-violet-600
            px-5
            py-3
            text-white
            hover:bg-violet-700
          "
        >
          + Create Quiz
        </button>

      </div>

      {quizzes.length === 0 ? (

        <div className="rounded-xl border p-8 text-slate-500">

          No quizzes yet.

        </div>

      ) : (

        <div className="grid gap-4">

          {quizzes.map((quiz) => (

            <div
              key={quiz.id}
              className="
                rounded-xl
                border
                p-6
              "
            >

              <h3 className="text-xl font-bold">
                {quiz.title}
              </h3>

              <p className="mt-2 text-slate-600">
                {quiz.description}
              </p>

              <div className="mt-4 flex gap-8">

                <span>
                  ⏱ {quiz.time_limit} mins
                </span>

                <span>
                  📝 {quiz.total_marks} Marks
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}