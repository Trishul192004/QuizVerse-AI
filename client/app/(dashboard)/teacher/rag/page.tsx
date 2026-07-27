"use client";

import ClassroomGrid from "@/components/classroom/ClassroomGrid";

export default function AIStudyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          AI Study
        </h1>

        <p className="mt-2 text-slate-500">
          Choose a classroom to manage its AI Study.
        </p>
      </div>

      <ClassroomGrid aiStudy />
    </div>
  );
}