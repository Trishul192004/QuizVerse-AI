"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function PasswordInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div className="space-y-2">

      <Label htmlFor={id}>
        {label}
      </Label>

      <div className="relative">

        <Input
          id={id}
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder={
            placeholder ||
            "Enter password"
          }
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}