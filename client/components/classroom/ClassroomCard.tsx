"use client";

import { useRouter } from "next/navigation";

import {
  Users,
  Copy,
  CalendarDays,
  Trash2,
  ArrowRight,
  Brain,
  Sparkles,
  ShieldCheck,
  FileText,
} from "lucide-react";

import { toast } from "sonner";

interface ClassroomCardProps {
  id: number;
  name: string;
  joinCode: string;
  students: number;
  createdAt: string;
  onDelete: (id: number) => void;
  aiStudy?: boolean;
}

export default function ClassroomCard({
  id,
  name,
  joinCode,
  students,
  createdAt,
  onDelete,
  aiStudy = false,
}: ClassroomCardProps) {

  const router = useRouter();

  const copyCode = async () => {
    try {

      await navigator.clipboard.writeText(joinCode);

      toast.success(
        "Join code copied successfully!"
      );

    } catch {

      toast.error(
        "Failed to copy join code"
      );

    }
  };

  return (

    <div
      onClick={() => {

        alert(`AI Study = ${aiStudy}`);

        router.push(
          aiStudy
            ? `/teacher/rag/classroom/${id}`
            : `/teacher/classrooms/${id}`
        );

      }}
      className="
        group
        relative
        cursor-pointer
        overflow-hidden
        rounded-3xl
        border
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-violet-400
        hover:shadow-2xl
      "
    >

      {/* Animated background */}

      {aiStudy && (

        <>
          <div
            className="
              absolute
              -right-16
              -top-16
              h-40
              w-40
              rounded-full
              bg-violet-500/10
              blur-3xl
              transition-all
              duration-700
              group-hover:scale-125
            "
          />

          <div
            className="
              absolute
              -bottom-12
              -left-12
              h-36
              w-36
              rounded-full
              bg-cyan-400/10
              blur-3xl
              transition-all
              duration-700
              group-hover:scale-125
            "
          />
        </>

      )}

      <div className="relative z-10">

        {/* Top Row */}

        <div className="flex items-start justify-between">

          <div>

            {aiStudy && (

              <div
                className="
                  mb-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-violet-200
                  bg-violet-50
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-violet-700
                "
              >

                <Brain className="h-4 w-4" />

                AI READY

              </div>

            )}

            <h2
              className="
                text-2xl
                font-extrabold
                tracking-tight
                transition-colors
                duration-300
                group-hover:text-violet-700
              "
            >
              {name}
            </h2>

            {aiStudy ? (

              <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">

                Build an intelligent knowledge base
                using Retrieval-Augmented Generation,
                semantic search, and AI-powered answers.

              </p>

            ) : (

              <p className="mt-3 text-sm text-slate-500">

                Manage quizzes, students, and classroom
                activities.

              </p>

            )}

          </div>

          {!aiStudy && (

            <div className="flex items-center gap-2">

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyCode();
                }}
                className="
                  rounded-xl
                  p-2.5
                  transition
                  hover:bg-slate-100
                "
                title="Copy Join Code"
              >
                <Copy size={18} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="
                  rounded-xl
                  p-2.5
                  text-red-500
                  transition
                  hover:bg-red-100
                "
                title="Delete Classroom"
              >
                <Trash2 size={18} />
              </button>

            </div>

          )}

        </div>

        {aiStudy && (

          <div className="mt-6 flex flex-wrap gap-2">

            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">

              <Sparkles className="h-3.5 w-3.5" />

              Semantic Search

            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">

              <FileText className="h-3.5 w-3.5" />

              PDF Knowledge

            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">

              <ShieldCheck className="h-3.5 w-3.5" />

              RAG Enabled

            </div>

          </div>

        )}

        <div className="mt-6 space-y-4">
                    {/* Metadata */}

          <div className="flex items-center gap-3 text-slate-600">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition group-hover:bg-violet-100">

              <Users className="h-5 w-5" />

            </div>

            <div>

              <p className="text-xs uppercase tracking-wide text-slate-400">
                Students
              </p>

              <p className="font-semibold">
                {students} Students
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3 text-slate-600">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition group-hover:bg-violet-100">

              <CalendarDays className="h-5 w-5" />

            </div>

            <div>

              <p className="text-xs uppercase tracking-wide text-slate-400">
                Created
              </p>

              <p className="font-semibold">
                {createdAt}
              </p>

            </div>

          </div>

        </div>

        {/* Bottom */}

        {!aiStudy ? (

          <>

            <div
              className="
                mt-6
                rounded-2xl
                border
                bg-slate-50
                p-4
                transition
                group-hover:border-violet-200
                group-hover:bg-violet-50
              "
            >

              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Join Code
              </p>

              <div className="flex items-center justify-between">

                <span className="font-mono text-lg font-bold tracking-[0.25em]">
                  {joinCode}
                </span>

                <Copy className="h-5 w-5 text-slate-400" />

              </div>

            </div>

          </>

        ) : (

          <div className="mt-8 space-y-4">

            <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 via-indigo-50 to-cyan-50 p-4">

              <p className="text-sm font-semibold text-violet-700">
                AI Workspace
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Upload PDFs, build embeddings,
                perform semantic search, and
                chat with your classroom
                knowledge base.
              </p>

            </div>

            <button
              className="
                group/button
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-2xl
                bg-gradient-to-r
                from-indigo-600
                via-violet-600
                to-purple-600
                px-5
                py-4
                font-semibold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-2xl
              "
            >

              <Brain className="h-5 w-5" />

              Launch AI Workspace

              <ArrowRight
                className="
                  h-5
                  w-5
                  transition-transform
                  duration-300
                  group-hover/button:translate-x-1
                "
              />

            </button>

          </div>

        )}

      </div>

    </div>

  );

}