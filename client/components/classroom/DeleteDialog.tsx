"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Trash2 } from "lucide-react";

interface DeleteClassroomDialogProps {
  classroomName: string;
  onConfirm: () => void;
}

export default function DeleteClassroomDialog({
  classroomName,
  onConfirm,
}: DeleteClassroomDialogProps) {
  return (
    <AlertDialog>

      <AlertDialogTrigger asChild>

        <button
          className="
            rounded-lg
            p-2
            text-red-500
            transition
            hover:bg-red-100
          "
          title="Delete Classroom"
        >
          <Trash2 size={18} />
        </button>

      </AlertDialogTrigger>

      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>
            Delete Classroom?
          </AlertDialogTitle>

          <AlertDialogDescription>

            Are you sure you want to delete

            <strong>
              {" "}
              {classroomName}
            </strong>

            ?

            <br />
            <br />

            This action cannot be undone.

          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  );
}