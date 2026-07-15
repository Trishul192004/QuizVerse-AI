"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  updateQuestion,
  Question,
} from "@/services/api/question.service";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  question: Question | null;
  onSuccess: () => void;
}

export default function EditQuestionDialog({
  open,
  onClose,
  question,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
    marks: 1,
  });

  useEffect(() => {
    if (question) {
      setForm({
        question: question.question,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        correct_option: question.correct_option,
        marks: question.marks,
      });
    }
  }, [question]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "marks"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!question) return;

    try {
      setLoading(true);

      await updateQuestion(question.id, {
        ...form,
        correct_option:
          form.correct_option as "A" | "B" | "C" | "D",
      });

      toast.success("Question Updated Successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white rounded-2xl shadow-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">
            Edit Question
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-slate-400">Question</Label>
            <Textarea
              name="question"
              value={form.question}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 mt-1"
            />
          </div>

          <div>
            <Label className="text-slate-400">Option A</Label>
            <Input
              name="option_a"
              value={form.option_a}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 mt-1"
            />
          </div>

          <div>
            <Label className="text-slate-400">Option B</Label>
            <Input
              name="option_b"
              value={form.option_b}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 mt-1"
            />
          </div>

          <div>
            <Label className="text-slate-400">Option C</Label>
            <Input
              name="option_c"
              value={form.option_c}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 mt-1"
            />
          </div>

          <div>
            <Label className="text-slate-400">Option D</Label>
            <Input
              name="option_d"
              value={form.option_d}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-400">Correct Option</Label>
              <select
                name="correct_option"
                value={form.correct_option}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-white outline-none mt-1"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <div>
              <Label className="text-slate-400">Marks</Label>
              <Input
                name="marks"
                type="number"
                value={form.marks}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 mt-1"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 mt-4"
          >
            {loading ? "Updating..." : "Update Question"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}