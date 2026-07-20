"use client";

import { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Copy,
  Users,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface StudentClassroomCardProps {
  id: number;
  name: string;
  joinCode: string;
  createdAt: string;
}

export default function StudentClassroomCard({
  id,
  name,
  joinCode,
  createdAt,
}: StudentClassroomCardProps) {
  const router = useRouter();

  const copyCode = async (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    try {
        await navigator.clipboard.writeText(joinCode);
      toast.success("Join code copied successfully!");
      } catch {
       toast.error("Failed to copy join code");
    }
    };

    return (
    <div
      onClick={() => router.push(`/student/classrooms/${id}`)}
      className="
        cursor-pointer
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-500/60
        hover:shadow-lg
      "
    >
      <div className="flex items-start justify-between gap-4">
          <div>
          <h2 className="text-xl font-bold text-white">
            {name}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Joined classroom
          </p>
         </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyCode}
            className="
              rounded-lg
              p-2
              text-slate-300
              hover:bg-slate-800
              hover:text-white
            "
            title="Copy Join Code"
          >
            <Copy size={18} />
          </button>

          <ArrowRight
            size={20}
            className="text-cyan-400"
          />
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-300">
          <div className="flex items-center gap-2">
          <Users size={18} />
          <span>Enrolled classroom</span>
        </div>

        <div className="flex items-center gap-2">
            <CalendarDays size={18} />
          <span>{createdAt}</span>
        </div>

        <div
          className="
            rounded-lg
            bg-slate-800
            p-3
            font-mono
            font-semibold
            tracking-widest
            text-cyan-300
          "
        >
          Join Code: {joinCode}
        </div>
        </div>
      </div>
    );
  }