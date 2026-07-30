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
  loginSchema,
  LoginFormValues,
} from "@/utils/validation";

import { login } from "@/services/api/auth.service";

import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();

  const { login: authLogin } = useAuth();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (
    data: LoginFormValues
  ) => {
    try {
      setLoading(true);

      const response = await login(data);

      authLogin(
        response.accessToken,
        response.refreshToken,
        response.user
      );

      toast.success("Login Successful");

      switch (response.user.role) {
        case "teacher":
          router.push("/teacher/dashboard");
          break;

        case "student":
          router.push("/student/dashboard");
          break;

        case "admin":
          router.push("/admin/dashboard");
          break;

        default:
          router.push("/");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{
        message: string;
      }>;

      toast.error(
        axiosError.response?.data?.message ??
          "Login Failed"
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

      <PasswordInput
        id="password"
        label="Password"
        value={password}
        onChange={(value) =>
          setValue("password", value, {
            shouldValidate: true,
          })
        }
        error={errors.password?.message}
      />

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Signing In..."
          : "Login"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        {"Don't have an account? "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}