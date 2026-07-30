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
        border-slate-700
        bg-slate-900
        p-6
        shadow-md
        transition-all
        hover:shadow-xl
        hover:-translate-y-0.5
        duration-300
        text-white
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white leading-snug">
            {question.question}
          </h2>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Marks: {question.marks}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onEdit(question)}
            className="
              rounded-lg
              p-2
              text-slate-400
              hover:bg-slate-800
              hover:text-white
              transition-colors
            "
            title="Edit Question"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(question.id)}
            className="
              rounded-lg
              p-2
              text-red-400
              hover:bg-red-950/30
              hover:text-red-500
              transition-colors
            "
            title="Delete Question"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          ["A", question.option_a],
          ["B", question.option_b],
          ["C", question.option_c],
          ["D", question.option_d],
        ].map(([label, value]) => {
          const isCorrect = question.correct_option === label;
          return (
            <div
              key={label}
              className={`
                flex
                items-center
                justify-between
                rounded-xl
                border
                p-4
                transition-all
                duration-200
                ${isCorrect
                  ? "border-green-500 bg-green-950/30 text-green-400 shadow-sm shadow-green-900/20"
                  : "border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-800/70"
                }
              `}
            >
              <span className="text-sm font-medium leading-relaxed">
                <strong className={`mr-2 ${isCorrect ? "text-green-400" : "text-slate-400"}`}>
                  {label}.
                </strong>
                {value}
              </span>

              {isCorrect && (
                <CheckCircle2
                  size={18}
                  className="text-green-400 shrink-0 ml-2 animate-pulse"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}