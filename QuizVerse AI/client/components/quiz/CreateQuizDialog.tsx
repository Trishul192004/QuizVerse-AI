"use client";

import { useState } from "react";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { createQuiz } from "@/services/api/quiz.service";

interface Props {
  classroomId: number;
  onSuccess: () => void;
}

export default function CreateQuizDialog({
  classroomId,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [timeLimit, setTimeLimit] =
    useState(15);

  const [totalMarks, setTotalMarks] =
    useState(10);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Quiz title required");
      return;
    }

    try {
      setLoading(true);

      await createQuiz({
        classroom_id: classroomId,
        title,
        description,
        time_limit: timeLimit,
        total_marks: totalMarks,
      });

      toast.success(
        "Quiz created successfully"
      );

      setTitle("");
      setDescription("");
      setTimeLimit(15);
      setTotalMarks(10);

      setOpen(false);

      onSuccess();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ??
          "Unable to create quiz"
      );
    } finally {
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
          + Create Quiz
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">

        <DialogHeader>
          <DialogTitle>
            Create Quiz
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          <div>
            <Label>
              Quiz Title
            </Label>

            <Input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Java Basics"
            />
          </div>

          <div>
            <Label>
              Description
            </Label>

            <Textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Quiz description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <Label>
                Time Limit (mins)
              </Label>

              <Input
                type="number"
                value={timeLimit}
                onChange={(e) =>
                  setTimeLimit(
                    Number(e.target.value)
                  )
                }
              />
            </div>

            <div>
              <Label>
                Total Marks
              </Label>

              <Input
                type="number"
                value={totalMarks}
                onChange={(e) =>
                  setTotalMarks(
                    Number(e.target.value)
                  )
                }
              />
            </div>

          </div>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreate}
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Quiz"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}