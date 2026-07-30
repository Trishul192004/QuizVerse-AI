"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createClassroom } from "@/services/api/classroom.service";

interface CreateClassroomFormValues {
  name: string;
}

export default function ClassroomForm() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateClassroomFormValues>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (
    data: CreateClassroomFormValues
  ) => {

    try {

      setLoading(true);

      const response =
        await createClassroom(data);

      toast.success(
        response.message ?? "Classroom created successfully"
      );

      reset();

      router.push("/teacher/classrooms");

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
          : "Failed to create classroom";

      toast.error(
        message
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >

      <div className="space-y-2">

        <Label htmlFor="name">
          Classroom Name
        </Label>

        <Input
          id="name"
          type="text"
          placeholder="Enter classroom name"
          {...register("name", {
            required: "Classroom name is required",
          })}
        />

        {errors.name && (

          <p className="text-sm text-red-500">

            {errors.name.message}

          </p>

        )}

      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >

        {loading
          ? "Creating..."
          : "Create Classroom"}

      </Button>

    </form>

  );

}