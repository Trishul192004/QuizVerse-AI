"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import {
  getStudentClassroomQuizzes,
} from "@/services/api/student.service";

interface Classroom {
  id: number;
  name: string;
  teacher_name: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export default function StudentClassroomDetailPage() {
  const params = useParams();
  const classroomId = Number(params.id);

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getStudentClassroomQuizzes(classroomId);
        setClassroom(response.classroom);
        setQuizzes(response.quizzes);
      } catch (error: any) {
        console.error(error);
        toast.error(
          error?.response?.data?.message ||
          "Failed to load classroom details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (classroomId) {
      loadData();
    }
  }, [classroomId]);

  if (loading) {
    return (
      <div className="p-8 text-white">
        Loading classroom details...
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="space-y-4 p-8">
        <p className="text-slate-400">Classroom not found.</p>
        <Link
          href="/student/dashboard"
          className="text-violet-400 hover:text-violet-300"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <Link
        href="/student/dashboard"
        className="flex items-center gap-2 text-slate-400 hover:text-white transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-white">
          {classroom.name}
        </h1>
        <p className="mt-2 text-slate-400">
          Teacher: {classroom.teacher_name}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          Quizzes
        </h2>

        {quizzes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center text-slate-400">
            No quizzes available yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all hover:border-violet-500/60"
              >
                <div className="flex items-start gap-3">
                  <BookOpen size={20} className="text-violet-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {quiz.title}
                    </h3>
                    {quiz.description && (
                      <p className="mt-1 text-sm text-slate-400">
                        {quiz.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-slate-300">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>
                      {new Date(quiz.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
