"use client";

import {
  Users,
  Copy,
  CalendarDays,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

interface ClassroomCardProps {
  id: number;
  name: string;
  joinCode: string;
  students: number;
  createdAt: string;

  onDelete: (id: number) => void;
}

export default function ClassroomCard({
  id,
  name,
  joinCode,
  students,
  createdAt,
  onDelete,
}: ClassroomCardProps) {
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
      className="
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

        <div className="flex items-center gap-2">

          <button
            onClick={copyCode}
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
            onClick={() => onDelete(id)}
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

      </div>

    </div>
  );
}