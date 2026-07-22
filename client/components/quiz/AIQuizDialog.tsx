"use client";

import { useEffect, useState } from "react";
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

import {
  generateQuizPreview,
  saveAIQuiz,
  AIQuestion,
} from "@/services/api/ai.service";

import {
  Classroom,
  getTeacherClassrooms,
} from "@/services/api/classroom.service";

interface Props {
  classroomId?: number;
  onSuccess?: () => void;
}

export default function AIQuizDialog({
  classroomId,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [form, setForm] = useState({
    classroom_id: classroomId ?? 0,
    title: "",
    description: "",
    topic: "",
    difficulty: "Easy",
    questionCount: 5,
    time_limit: 20,
    type: "MCQ",
  });

  useEffect(() => {
    if (!open) return;

    const loadClassrooms = async () => {
      try {
        const res = await getTeacherClassrooms();

        setClassrooms(res.classrooms);

        if (res.classrooms.length > 0) {
          setForm((prev) => ({
            ...prev,
            classroom_id:
              classroomId ?? res.classrooms[0].id,
          }));
        }
      } catch {
        toast.error("Failed to load classrooms");
      }
    };

    loadClassrooms();
  }, [open, classroomId]);

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleQuestionChange = (
    index: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              question: value,
            }
          : q
      )
    );
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== questionIndex) return q;

        const options = [...q.options];
        options[optionIndex] = value;

        return {
          ...q,
          options,
        };
      })
    );
  };

  const handleAnswerChange = (
    index: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              answer: value,
            }
          : q
      )
    );
  };

  const handleExplanationChange = (
    index: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              explanation: value,
            }
          : q
      )
    );
  };

    const handleGenerate = async () => {
    if (!form.title.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    if (!form.topic.trim()) {
      toast.error("Topic is required");
      return;
    }

    try {
      setLoading(true);

      const res = await generateQuizPreview(form);

      console.log("AI Response:", res);

      setQuestions(res.data.questions);

      setEditingIndex(null);

      toast.success("Quiz generated successfully");
    } catch (err: any) {
      console.error(err);

      toast.error(
        err.response?.data?.message ??
          err.message ??
          "Failed to generate quiz"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (questions.length === 0) {
      toast.error("Generate a quiz first");
      return;
    }

    try {
      setLoading(true);

      await saveAIQuiz({
        classroom_id: form.classroom_id,
        title: form.title,
        description: form.description,
        time_limit: form.time_limit,
        questions,
      });

      toast.success("Quiz saved successfully");

      setQuestions([]);
      setEditingIndex(null);

      setForm({
        classroom_id:
          classrooms.length > 0
            ? classrooms[0].id
            : 0,
        title: "",
        description: "",
        topic: "",
        difficulty: "Easy",
        questionCount: 5,
        time_limit: 20,
        type: "MCQ",
      });

      setOpen(false);

      onSuccess?.();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ??
          "Failed to save quiz"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuestions([]);
    setEditingIndex(null);
  };

  const handleClose = () => {
    setOpen(false);
    handleReset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          ✨ Generate AI Quiz
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle className="text-2xl">
            Generate AI Quiz
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
            <div>
  <Label>Quiz Title</Label>

  <Input
    className="mt-2"
    placeholder="Java Basics Quiz"
    value={form.title}
    onChange={(e) =>
      setForm({
        ...form,
        title: e.target.value,
      })
    }
  />
</div>

<div>
  <Label>Description</Label>

  <Textarea
    className="mt-2"
    placeholder="Quiz description..."
    value={form.description}
    onChange={(e) =>
      setForm({
        ...form,
        description: e.target.value,
      })
    }
  />
</div>

<div>
  <Label>Topic</Label>

  <Input
    className="mt-2"
    placeholder="Java Collections"
    value={form.topic}
    onChange={(e) =>
      setForm({
        ...form,
        topic: e.target.value,
      })
    }
  />
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-5">

  <div>
    <Label>Difficulty</Label>

    <select
      className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3"
      value={form.difficulty}
      onChange={(e) =>
        setForm({
          ...form,
          difficulty: e.target.value,
        })
      }
    >
      <option value="Easy">Easy</option>
      <option value="Medium">Medium</option>
      <option value="Hard">Hard</option>
    </select>
  </div>

  <div>
    <Label>Question Count</Label>

    <Input
      className="mt-2"
      type="number"
      min={1}
      max={20}
      value={form.questionCount}
      onChange={(e) =>
        setForm({
          ...form,
          questionCount: Number(e.target.value),
        })
      }
    />
  </div>

</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-5">

  <div>
    <Label>Time Limit (Minutes)</Label>

    <Input
      className="mt-2"
      type="number"
      min={1}
      value={form.time_limit}
      onChange={(e) =>
        setForm({
          ...form,
          time_limit: Number(e.target.value),
        })
      }
    />
  </div>

  <div>
    <Label>Classroom</Label>

    <select
      className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3"
      value={form.classroom_id}
      onChange={(e) =>
        setForm({
          ...form,
          classroom_id: Number(e.target.value),
        })
      }
    >
      {classrooms.map((classroom) => (
        <option
          key={classroom.id}
          value={classroom.id}
        >
          {classroom.name}
        </option>
      ))}
    </select>
  </div>

</div>

{questions.length > 0 && (
  <div className="mt-8 border-t pt-8">

    <div className="flex items-center justify-between mb-6">

      <div>
        <h2 className="text-2xl font-bold">
          Generated Questions
        </h2>

        <p className="text-sm text-muted-foreground mt-1">
          Review, edit or delete AI generated questions before saving.
        </p>
      </div>

      <div className="flex items-center gap-3">

        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          {questions.length} Questions
        </span>

        <Button
          variant="outline"
          onClick={handleGenerate}
          disabled={loading}
        >
          🔄 Regenerate
        </Button>

      </div>

    </div>

    <div className="space-y-6">{questions.map((q, index) => (
  <div
    key={index}
    className="rounded-xl border bg-card shadow-sm p-6 transition-all hover:shadow-md"
  >
    <div className="flex items-start justify-between gap-4">

      <div className="flex-1">

        {editingIndex === index ? (
          <Input
            className="text-lg font-semibold"
            value={q.question}
            onChange={(e) =>
              handleQuestionChange(
                index,
                e.target.value
              )
            }
          />
        ) : (
          <h3 className="text-lg font-semibold">
            Q{index + 1}. {q.question}
          </h3>
        )}

      </div>

      <div className="flex gap-2">

        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setEditingIndex(
              editingIndex === index
                ? null
                : index
            )
          }
        >
          {editingIndex === index
            ? "Done"
            : "Edit"}
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() =>
            handleDeleteQuestion(index)
          }
        >
          Delete
        </Button>

      </div>

    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

      {q.options.map((option, optionIndex) => (
        <div
          key={optionIndex}
          className={`rounded-lg border p-4 transition-colors ${
            option === q.answer
              ? "border-green-500 bg-green-50"
              : "border-border"
          }`}
        >
          <div className="font-semibold mb-2">
            {String.fromCharCode(
              65 + optionIndex
            )}
          </div>

          {editingIndex === index ? (
            <Input
              value={option}
              onChange={(e) =>
                handleOptionChange(
                  index,
                  optionIndex,
                  e.target.value
                )
              }
            />
          ) : (
            <p>{option}</p>
          )}
        </div>
      ))}

    </div>

    <div className="mt-6 rounded-lg bg-muted p-5">

      <Label className="font-semibold">
        Correct Answer
      </Label>

      {editingIndex === index ? (
        <Input
          className="mt-2"
          value={q.answer}
          onChange={(e) =>
            handleAnswerChange(
              index,
              e.target.value
            )
          }
        />
      ) : (
        <p className="mt-2">
          {q.answer}
        </p>
      )}

      <Label className="mt-5 block font-semibold">
        Explanation
      </Label>

      {editingIndex === index ? (
        <Textarea
          className="mt-2"
          value={q.explanation}
          onChange={(e) =>
            handleExplanationChange(
              index,
              e.target.value
            )
          }
        />
      ) : (
        <p className="mt-2 text-muted-foreground">
          {q.explanation}
        </p>
      )}

    </div>

  </div>
))}    </div>
  </div>
)}

</div>

<DialogFooter className="mt-8 border-t pt-6">

  <Button
    variant="outline"
    onClick={handleClose}
    disabled={loading}
  >
    Cancel
  </Button>

  {questions.length === 0 ? (

    <Button
      onClick={handleGenerate}
      disabled={loading}
    >
      {loading
        ? "Generating..."
        : "✨ Generate AI Quiz"}
    </Button>

  ) : (

    <>
      <Button
        variant="outline"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading
          ? "Generating..."
          : "🔄 Regenerate"}
      </Button>

      <Button
        onClick={handleSave}
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : "💾 Save Quiz"}
      </Button>
    </>

  )}

</DialogFooter>

</DialogContent>

</Dialog>
);
}
       