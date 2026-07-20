"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import Link from "next/link";

import StudentClassroomGrid from "@/components/classroom/Student.ClassroomGrid";

export default function StudentClassroomsPage() {
  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            My Classrooms
          </h1>
          <p className="mt-2 text-slate-400">
            View the classrooms you have joined.
          </p>
        </div>

        <Link
          href="/student/join"
          className="
            flex
            items-center
            gap-2
            rounded-lg
            bg-violet-600
            px-5
            py-3
            text-white
            transition
            hover:bg-violet-700
          "
        >
          <Plus size={18} />
          Join Classroom
        </Link>
      </div>

      <StudentClassroomGrid />
    </div>
  );
}
