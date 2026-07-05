"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import StudentClassroomCard from "./StudentClassroomCard";

import {
  getStudentClassrooms,
  StudentClassroom,
} from "@/services/api/classroom.service";

export default function StudentClassroomGrid() {

  const [classrooms, setClassrooms] =
    useState<StudentClassroom[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    let active = true;

    const loadClassrooms = async () => {

      try {

        const response =
          await getStudentClassrooms();

        if (active) {

          setClassrooms(
            response.classrooms
          );

        }

      } catch (error: unknown) {

        const message =
          error && typeof error === "object" &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "message" in error.response.data &&
          typeof error.response.data.message === "string"
            ? error.response.data.message
            : "Failed to load classrooms";

        toast.error(message);

      } finally {

        if (active) {

          setLoading(false);

        }

      }

    };

    void loadClassrooms();

    return () => {

      active = false;

    };

  }, []);

  if (loading) {

    return (
      <p className="text-slate-500">
        Loading classrooms...
      </p>
    );

  }

  if (classrooms.length === 0) {

    return (
      <p className="text-slate-500">
        You haven't joined any classrooms yet.
      </p>
    );

  }

  return (

    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {classrooms.map((classroom) => (

        <StudentClassroomCard
          key={classroom.id}
          name={classroom.name}
          joinCode={classroom.join_code}
          createdAt={
            new Date(
              classroom.created_at
            ).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )
          }
        />

      ))}

    </section>

  );

}