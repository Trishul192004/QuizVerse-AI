"use client";

import { useRouter } from "next/navigation";

import {
  Users,
  Copy,
  CalendarDays,
  Trash2,
  ArrowRight,
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
        cursor-pointer
        rounded-2xl
        border
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-bold">
          {name}
        </h2>

        {!aiStudy && (

          <div className="flex items-center gap-2">

            <button
              onClick={(e) => {
                e.stopPropagation();
                copyCode();
              }}
              className="
                rounded-lg
                p-2
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
                rounded-lg
                p-2
                text-red-500
                hover:bg-red-100
              "
              title="Delete Classroom"
            >
              <Trash2 size={18} />
            </button>

          </div>

        )}

      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-600">

        <div className="flex items-center gap-2">

          <Users size={18} />

          <span>
            {students} Students
          </span>

        </div>

        <div className="flex items-center gap-2">

          <CalendarDays size={18} />

          <span>
            {createdAt}
          </span>

        </div>

        {!aiStudy ? (

          <div
            className="
              rounded-lg
              bg-slate-100
              p-3
              font-mono
              font-semibold
              tracking-widest
            "
          >
            Join Code: {joinCode}
          </div>

        ) : (

          <button
            className="
              mt-4
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-indigo-600
              px-4
              py-3
              font-semibold
              text-white
              transition
              hover:bg-indigo-700
            "
          >
            Open AI Study
            <ArrowRight size={18} />
          </button>

        )}

      </div>

    </div>

  );

}