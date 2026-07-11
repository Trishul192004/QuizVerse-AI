"use client";

import {
  Pencil,
  Trash2,
 CheckCircle2,
} from "lucide-react";

import { Question } from "@/services/api/question.service";

interface QuestionCardProps {
  question: Question;

  onEdit: (question: Question) => void;

  onDelete: (id: number) => void;
}

export default function QuestionCard({
  question,
  onEdit,
  onDelete,
}: QuestionCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        bg-white
        p-6
        shadow-sm
        transition-all
        hover:shadow-lg
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-lg font-bold">
            {question.question}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Marks : {question.marks}
          </p>

        </div>

        <div className="flex gap-2">

          <button
            onClick={() => onEdit(question)}
            className="
              rounded-lg
              p-2
              hover:bg-slate-100
            "
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() =>
              onDelete(question.id)
            }
            className="
              rounded-lg
              p-2
              text-red-500
              hover:bg-red-100
            "
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>

      {/* Options */}

      <div className="mt-6 grid gap-3">

        {[
          ["A", question.option_a],
          ["B", question.option_b],
          ["C", question.option_c],
          ["D", question.option_d],
        ].map(([label, value]) => (

          <div
            key={label}
            className={`
              flex
              items-center
              justify-between
              rounded-lg
              border
              p-3

              ${
                question.correct_option === label
                  ? "border-green-500 bg-green-50"
                  : ""
              }
            `}
          >

            <span>

              <strong>{label}.</strong>{" "}

              {value}

            </span>

            {question.correct_option ===
              label && (
              <CheckCircle2
                size={18}
                className="text-green-600"
              />
            )}

          </div>

        ))}

      </div>

    </div>
  );
}