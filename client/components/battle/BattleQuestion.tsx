"use client";

import { CheckCircle2, CircleHelp } from "lucide-react";

import BattleCard from "./BattleCard";

interface BattleQuestionProps {
  question: any;
  selectedOption: string;
  submitted: boolean;
  onSelect: (option: string) => void;
  onSubmit: () => void;
}

export default function BattleQuestion({
  question,
  selectedOption,
  submitted,
  onSelect,
  onSubmit,
}: BattleQuestionProps) {
  if (!question) return null;

  return (
    <BattleCard
      title="Battle Question"
      icon={<CircleHelp className="h-5 w-5" />}
    >
      <div className="space-y-8">
        {/* Question */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-400">
            Current Question
          </p>

          <h2 className="text-2xl font-bold leading-relaxed text-white md:text-3xl">
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="grid gap-4">
          {["A", "B", "C", "D"].map((option) => {
            const selected = selectedOption === option;

            return (
              <button
                key={option}
                disabled={submitted}
                onClick={() => onSelect(option)}
                className={`
                  group flex w-full items-center gap-5 rounded-2xl border p-5
                  text-left transition-all duration-300

                  ${
                    selected
                      ? "border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.01]"
                      : "border-slate-700 bg-slate-900 text-slate-200 hover:border-indigo-500 hover:bg-slate-800 hover:-translate-y-0.5"
                  }

                  ${submitted ? "cursor-not-allowed opacity-70" : ""}
                `}
              >
                <div
                  className={`
                    flex h-11 w-11 items-center justify-center rounded-full
                    font-bold transition-all

                    ${
                      selected
                        ? "bg-white text-indigo-700"
                        : "bg-slate-800 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white"
                    }
                  `}
                >
                  {option}
                </div>

                <div className="flex-1 text-lg font-medium">
                  {question[`option_${option.toLowerCase()}`]}
                </div>

                {selected && (
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Submit */}
        <button
          onClick={onSubmit}
          disabled={!selectedOption || submitted}
          className="
            w-full rounded-2xl
            bg-gradient-to-r
            from-indigo-600
            via-violet-600
            to-purple-600
            py-4
            text-lg
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-[1.01]
            hover:shadow-xl
            hover:shadow-indigo-600/30
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {submitted ? "Waiting for Next Question..." : "Submit Answer"}
        </button>
      </div>
    </BattleCard>
  );
}