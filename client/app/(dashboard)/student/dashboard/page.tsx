"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import JoinClassroomDialog from "@/components/student/JoinClassroomDialog";

import {
  StudentClassroom,
  getStudentClassrooms,
} from "@/services/api/student.service";

import { toast } from "sonner";

export default function StudentDashboardPage() {

  const router = useRouter();

  const [classrooms, setClassrooms] =
    useState<StudentClassroom[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [joinOpen, setJoinOpen] =
    useState(false);

  /*
  ===========================================
  LOAD CLASSROOMS
  ===========================================
  */

  const loadClassrooms = async () => {

    try {

      setLoading(true);

      const response =
        await getStudentClassrooms();

      setClassrooms(
        response.classrooms
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load classrooms."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadClassrooms();

  }, []);

  if (loading) {

    return (

      <div className="p-8 text-white">

        Loading...

      </div>

    );

  }

  return (

    <div className="space-y-8 p-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-white">

            Student Dashboard

          </h1>

          <p className="mt-2 text-slate-400">

            View and join your classrooms.

          </p>

        </div>

        <button
          onClick={() => setJoinOpen(true)}
          className="
            rounded-lg
            bg-violet-600
            px-5
            py-3
            text-white
            hover:bg-violet-700
          "
        >

          + Join Classroom

        </button>

      </div>

      {/* Classroom List */}

      {classrooms.length === 0 ? (

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-slate-700
            bg-slate-900
            p-10
            text-center
            text-slate-400
          "
        >

          You haven't joined any classrooms yet.

        </div>

      ) : (

        <div className="grid gap-5">

          {classrooms.map((classroom) => (

            <div
              key={classroom.id}
              onClick={() =>
                router.push(
                  `/student/classrooms/${classroom.id}`
                )
              }
              className="
                cursor-pointer
                rounded-2xl
                border
                border-slate-700
                bg-slate-900
                p-6
                shadow-md
                transition-all
                hover:border-violet-500
                hover:shadow-xl
                hover:scale-[1.01]
              "
            >

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-bold text-white">

                  {classroom.name}

                </h2>

                <span
                  className="
                    rounded-full
                    bg-violet-600
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-white
                  "
                >

                  Open →

                </span>

              </div>

              <p className="mt-2 text-slate-400">

                Teacher: {classroom.teacher_name}

              </p>

              <div className="mt-5 flex flex-wrap gap-6 text-sm text-slate-300">

                <span>

                  Join Code: {classroom.join_code}

                </span>

                <span>

                  Created:{" "}
                  {new Date(
                    classroom.created_at
                  ).toLocaleDateString()}

                </span>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* Join Classroom Dialog */}

      <JoinClassroomDialog
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        onSuccess={loadClassrooms}
      />

    </div>

  );

}