"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { joinClassroom } from "@/services/api/classroom.service";

interface JoinClassroomFormValues {
  joinCode: string;
}

export default function JoinClassroomForm() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JoinClassroomFormValues>({
    defaultValues: {
      joinCode: "",
    },
  });

  const onSubmit = async (
    data: JoinClassroomFormValues
  ) => {

    try {

      setLoading(true);

      const response =
        await joinClassroom(data);

      toast.success(
        response.message
      );

      reset();

      // We'll create this page next
      router.push("/student/classrooms");

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
          : "Failed to join classroom";

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

      {/* Join Code */}

      <div className="space-y-2">

        <Label htmlFor="joinCode">
          Join Code
        </Label>

        <Input
          id="joinCode"
          type="text"
          placeholder="Enter classroom join code"
          {...register("joinCode", {
            required: "Join code is required",
          })}
        />

        {errors.joinCode && (

          <p className="text-sm text-red-500">

            {errors.joinCode.message}

          </p>

        )}

      </div>

      {/* Submit */}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >

        {loading
          ? "Joining..."
          : "Join Classroom"}

      </Button>

    </form>

  );

}   