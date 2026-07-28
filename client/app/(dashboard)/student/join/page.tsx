import { BookOpen } from "lucide-react";

import JoinClassroomForm from "@/components/classroom/JoinClassroomForm";

export default function JoinClassroomPage() {
  return (
    <div className="flex w-full justify-center px-6 py-10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg">
            <BookOpen className="h-7 w-7" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white">
            Join Classroom
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Enter the classroom join code shared by your teacher to instantly
            access quizzes, AI Study content, and classroom activities.
          </p>
        </div>

        {/* Join Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl backdrop-blur-sm">
          <JoinClassroomForm />
        </div>
      </div>
    </div>
  );
}