"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import ClassroomCard from "./ClassroomCard";

import {
  getTeacherClassrooms,
  deleteClassroom,
} from "@/services/api/classroom.service";

interface Classroom {
  id: number;
  name: string;
  join_code: string;
  created_at: string;
}

export default function ClassroomGrid() {

  const [classrooms, setClassrooms] =
    useState<Classroom[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchClassrooms();

  }, []);

  const fetchClassrooms = async () => {

    try {

      const response =
        await getTeacherClassrooms();

      setClassrooms(
        response.classrooms
      );

    } catch (error: any) {

      toast.error(
        error?.response?.data?.message ??
        "Failed to load classrooms"
      );

    } finally {

      setLoading(false);

    }

  };

  const handleDelete = async (
    id: number
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this classroom?"
      );

    if (!confirmed) return;

    try {

      const response =
        await deleteClassroom(id);

      toast.success(
        response.message
      );

      setClassrooms((prev) =>
        prev.filter(
          (classroom) =>
            classroom.id !== id
        )
      );

    } catch (error: any) {

      toast.error(
        error?.response?.data?.message ??
        "Failed to delete classroom"
      );

    }

  };

  if (loading) {

    return (
      <p>
        Loading classrooms...
      </p>
    );

  }

  if (classrooms.length === 0) {

    return (
      <p className="text-slate-500">
        No classrooms found.
      </p>
    );

  }

  return (

    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {classrooms.map((classroom) => (

        <ClassroomCard
          key={classroom.id}
          id={classroom.id}
          name={classroom.name}
          joinCode={classroom.join_code}
          students={0}
          createdAt={new Date(
            classroom.created_at
          ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          onDelete={handleDelete}
        />

      ))}

    </section>

  );

}