"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

import {
  createQuestion,
} from "@/services/api/question.service";

interface Props {
  quizId: number;

  onSuccess: () => void;
}

export default function AddQuestionDialog({
  quizId,
  onSuccess,
}: Props) {

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      question: "",

      option_a: "",

      option_b: "",

      option_c: "",

      option_d: "",

      correct_option: "A",

      marks: 1,
    });

  const handleSubmit = async () => {

    try {

      setLoading(true);

      await createQuestion({

        quiz_id: quizId,

        ...form,

      });

      toast.success(
        "Question Added Successfully"
      );

      setOpen(false);

      onSuccess();

      setForm({

        question: "",

        option_a: "",

        option_b: "",

        option_c: "",

        option_d: "",

        correct_option: "A",

        marks: 1,

      });

    }

    catch (error) {

      console.error(error);

      toast.error(
        "Failed to add question"
      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogTrigger asChild>

        <Button>

          <Plus className="mr-2 h-4 w-4" />

          Add Question

        </Button>

      </DialogTrigger>

      <DialogContent className="max-w-2xl">

        <DialogHeader>

          <DialogTitle>

            Create Question

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <div>

            <Label>

              Question

            </Label>

            <Textarea
              value={form.question}
              onChange={(e) =>
                setForm({
                  ...form,
                  question:
                    e.target.value,
                })
              }
            />

          </div>

          <div>

            <Label>

              Option A

            </Label>

            <Input
              value={form.option_a}
              onChange={(e) =>
                setForm({
                  ...form,
                  option_a:
                    e.target.value,
                })
              }
            />

          </div>

          <div>

            <Label>

              Option B

            </Label>

            <Input
              value={form.option_b}
              onChange={(e) =>
                setForm({
                  ...form,
                  option_b:
                    e.target.value,
                })
              }
            />

          </div>

          <div>

            <Label>

              Option C

            </Label>

            <Input
              value={form.option_c}
              onChange={(e) =>
                setForm({
                  ...form,
                  option_c:
                    e.target.value,
                })
              }
            />

          </div>

          <div>

            <Label>

              Option D

            </Label>

            <Input
              value={form.option_d}
              onChange={(e) =>
                setForm({
                  ...form,
                  option_d:
                    e.target.value,
                })
              }
            />

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <Label>

                Correct Option

              </Label>

              <select
                className="
                  w-full
                  rounded-md
                  border
                  p-2
                "
                value={
                  form.correct_option
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    correct_option:
                      e.target.value,
                  })
                }
              >

                <option>A</option>

                <option>B</option>

                <option>C</option>

                <option>D</option>

              </select>

            </div>

            <div>

              <Label>

                Marks

              </Label>

              <Input
                type="number"
                value={form.marks}
                onChange={(e) =>
                  setForm({
                    ...form,
                    marks:
                      Number(
                        e.target.value
                      ),
                  })
                }
              />

            </div>

          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >

            {loading
              ? "Creating..."
              : "Create Question"}

          </Button>

        </div>

      </DialogContent>

    </Dialog>

  );

}