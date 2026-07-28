"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  KeyRound,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

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

  const [search, setSearch] =
    useState("");

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

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const term = search.toLowerCase();

      return (
        quiz.title
          .toLowerCase()
          .includes(term) ||
        quiz.description
          .toLowerCase()
          .includes(term)
      );
    });
  }, [quizzes, search]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-3xl border bg-card p-10 shadow-xl">
          <div className="flex flex-col items-center gap-5">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />

            <h2 className="text-xl font-semibold">
              Loading Classroom...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-10">
          <h2 className="text-2xl font-bold text-red-500">
            Classroom not found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">

      {/* Hero */}

      <div className="overflow-hidden rounded-3xl border bg-card shadow-xl">

        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="mb-3 flex items-center gap-2 text-indigo-100">

                <GraduationCap className="h-5 w-5" />

                <span className="font-medium">
                  Teacher Classroom
                </span>

              </div>

              <h1 className="text-4xl font-bold text-white">
                {classroom.name}
              </h1>

              <p className="mt-3 text-indigo-100">
                Manage quizzes, monitor
                classroom activity, and
                create engaging assessments.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <CreateQuizDialog
                classroomId={classroomId}
                onSuccess={loadData}
              />

              <AIQuizDialog
                classroomId={classroomId}
                onSuccess={loadData}
              />

            </div>

          </div>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border bg-card p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-muted-foreground">
                Join Code
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {classroom.join_code}
              </h2>

            </div>

            <KeyRound className="h-8 w-8 text-violet-500" />

          </div>

        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-muted-foreground">
                Students
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {classroom.students}
              </h2>

            </div>

            <Users className="h-8 w-8 text-blue-500" />

          </div>

        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-muted-foreground">
                Total Quizzes
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {quizzes.length}
              </h2>

            </div>

            <BookOpen className="h-8 w-8 text-green-500" />

          </div>

        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-muted-foreground">
                Created
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                {new Date(
                  classroom.created_at
                ).toLocaleDateString()}
              </h2>

            </div>

            <Calendar className="h-8 w-8 text-orange-500" />

          </div>

        </div>

      </div>

      {/* Quiz Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-3xl font-bold">
            Quizzes
          </h2>

          <p className="mt-1 text-muted-foreground">
            Showing{" "}
            <span className="font-semibold">
              {filteredQuizzes.length}
            </span>

            {filteredQuizzes.length !==
            quizzes.length
              ? ` of ${quizzes.length}`
              : ""}{" "}

            quizzes
          </p>

        </div>

        <div className="relative w-full lg:w-96">

          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border bg-background py-3 pl-12 pr-4 outline-none transition focus:border-violet-500"
          />

        </div>

      </div>
            {/* Quiz List */}

      {filteredQuizzes.length === 0 ? (

        <div className="rounded-3xl border border-dashed bg-card p-16">

          <div className="mx-auto max-w-md text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/20">

              <Sparkles className="h-10 w-10 text-violet-600" />

            </div>

            <h3 className="mt-6 text-2xl font-bold">
              {search
                ? "No matching quizzes"
                : "No quizzes yet"}
            </h3>

            <p className="mt-3 text-muted-foreground">

              {search
                ? "Try searching with another keyword."
                : "Create your first quiz or generate one using AI."}

            </p>

          </div>

        </div>

      ) : (

        <div className="grid gap-6">

          {filteredQuizzes.map((quiz) => (

            <Link
              key={quiz.id}
              href={`/teacher/quizzes/${quiz.id}`}
            >

              <div
                className="
                  group
                  rounded-3xl
                  border
                  bg-card
                  p-6
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-violet-500
                  hover:shadow-xl
                "
              >

                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                  <div className="flex-1">

                    <div className="mb-3 flex flex-wrap items-center gap-3">

                      <div className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/20 dark:text-violet-300">

                        Quiz

                      </div>

                      <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">

                        Active

                      </div>

                    </div>

                    <h3 className="text-2xl font-bold transition-colors group-hover:text-violet-600">

                      {quiz.title}

                    </h3>

                    <p className="mt-3 max-w-3xl text-muted-foreground">

                      {quiz.description}

                    </p>

                  </div>

                </div>

                <div className="mt-8 flex flex-wrap gap-3">

                  <div className="rounded-xl bg-muted px-4 py-2 text-sm font-medium">

                    ⏱ {quiz.time_limit} mins

                  </div>

                  <div className="rounded-xl bg-muted px-4 py-2 text-sm font-medium">

                    📝 {quiz.total_marks} Marks

                  </div>

                  <div className="rounded-xl bg-muted px-4 py-2 text-sm font-medium">

                    📅{" "}
                    {new Date(
                      quiz.created_at
                    ).toLocaleDateString()}

                  </div>

                </div>

              </div>

            </Link>

          ))}

        </div>

      )}

    </div>
  );
}