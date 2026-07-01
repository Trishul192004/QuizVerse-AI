import Link from "next/link";

import ClassroomGrid from "@/components/classroom/ClassroomGrid";

export default function TeacherClassroomsPage() {
  return (
    <div className="space-y-8 p-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            My Classrooms
          </h1>

          <p className="mt-1 text-slate-500">
            Manage your classrooms and invite students.
          </p>

        </div>

        <Link
          href="/teacher/classrooms/create"
          className="
            rounded-xl
            bg-indigo-600
            px-5
            py-3
            font-medium
            text-white
            transition
            hover:bg-indigo-700
          "
        >
          + Create Classroom
        </Link>

      </div>

      {/* Classroom Grid */}

      <ClassroomGrid />

    </div>
  );
}