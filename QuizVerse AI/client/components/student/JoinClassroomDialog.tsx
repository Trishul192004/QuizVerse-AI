"use client";

import { useState } from "react";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { joinClassroom } from "@/services/api/student.service";

interface JoinClassroomDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function JoinClassroomDialog({
  open,
  onClose,
  onSuccess,
}: JoinClassroomDialogProps) {

  const [joinCode, setJoinCode] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!joinCode.trim()) {

      toast.error(
        "Please enter a classroom code."
      );

      return;

    }

    try {

      setLoading(true);

      await joinClassroom(joinCode);

      toast.success(
        "Joined classroom successfully!"
      );

      setJoinCode("");

      onSuccess();

      onClose();

    } catch (error: any) {

      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to join classroom."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <Dialog
      open={open}
      onOpenChange={onClose}
    >

      <DialogContent className="bg-slate-900 border-slate-700">

        <DialogHeader>

          <DialogTitle className="text-white">
            Join Classroom
          </DialogTitle>

        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="mb-2 block text-sm text-slate-300">

              Classroom Join Code

            </label>

            <input
              type="text"
              value={joinCode}
              onChange={(e) =>
                setJoinCode(
                  e.target.value.toUpperCase()
                )
              }
              placeholder="Enter Join Code"
              className="
                w-full
                rounded-lg
                border
                border-slate-700
                bg-slate-800
                px-4
                py-3
                text-white
                outline-none
                focus:border-violet-500
              "
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-lg
              bg-violet-600
              py-3
              font-medium
              text-white
              transition
              hover:bg-violet-700
              disabled:opacity-50
            "
          >

            {loading
              ? "Joining..."
              : "Join Classroom"}

          </button>

        </form>

      </DialogContent>

    </Dialog>

  );

}