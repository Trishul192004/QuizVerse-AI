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
} from "@/components/ui/alert-dialog";

interface DeleteQuestionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteQuestionDialog({
  open,
  onClose,
  onConfirm,
}: DeleteQuestionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <AlertDialogContent className="bg-slate-900 border-slate-700 text-white rounded-2xl shadow-md">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="text-white text-xl font-bold">
            Delete Question
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400 text-sm mt-2">
            Are you sure you want to delete this question? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="border-t-0 bg-transparent flex justify-end gap-3 mt-6">
          <AlertDialogCancel
            onClick={onClose}
            className="border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white rounded-xl px-4 py-2"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 rounded-xl px-4 py-2"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}