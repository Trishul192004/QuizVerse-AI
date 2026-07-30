"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AxiosError } from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import PasswordInput from "./PasswordInput";

import {
  registerSchema,
  RegisterFormValues,
} from "@/utils/validation";

import {
  register as registerUser,
} from "@/services/api/auth.service";

export default function RegisterForm() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "teacher",
    },
  });

  const password = watch("password");

  const onSubmit = async (
    data: RegisterFormValues
  ) => {
    try {
      setLoading(true);

      const response =
        await registerUser(data);

      toast.success(
        response.message
      );

      router.push("/login");
    } catch (error) {
      const axiosError =
        error as AxiosError<{
          message: string;
        }>;

      toast.error(
        axiosError.response?.data
          ?.message ??
          "Registration Failed"
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
      {/* Username */}

      <div className="space-y-2">
        <Label htmlFor="username">
          Username
        </Label>

        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          {...register("username")}
        />

        {errors.username && (
          <p className="text-sm text-red-500">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Email */}

      <div className="space-y-2">
        <Label htmlFor="email">
          Email
        </Label>

        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}

      <PasswordInput
        id="password"
        label="Password"
        value={password}
        onChange={(value) =>
          setValue("password", value, {
            shouldValidate: true,
          })
        }
        error={
          errors.password?.message
        }
      />

      {/* Role */}

      <div className="space-y-2">
        <Label htmlFor="role">
          Role
        </Label>

        <select
          id="role"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register("role")}
        >
          <option value="teacher">
            Teacher
          </option>

          <option value="student">
            Student
          </option>
        </select>

        {errors.role && (
          <p className="text-sm text-red-500">
            {errors.role.message}
          </p>
        )}
      </div>

      {/* Register Button */}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Creating Account..."
          : "Create Account"}
      </Button>

      {/* Login Link */}

      <p className="text-center text-sm text-gray-500">
        {"Already have an account? "}

        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}