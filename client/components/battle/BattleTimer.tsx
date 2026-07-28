"use client";

import { Clock3 } from "lucide-react";

import BattleCard from "./BattleCard";

interface BattleTimerProps {
  timeLeft: number;
}

export default function BattleTimer({
  timeLeft,
}: BattleTimerProps) {
  const percentage = (timeLeft / 30) * 100;

  let progressColor = "bg-indigo-600";
  let numberColor = "text-indigo-400";

  if (timeLeft <= 10) {
    progressColor = "bg-amber-500";
    numberColor = "text-amber-400";
  }

  if (timeLeft <= 5) {
    progressColor = "bg-red-500";
    numberColor = "text-red-400";
  }

  return (
    <BattleCard
      title="Battle Timer"
      icon={<Clock3 className="h-5 w-5" />}
    >
      <div className="space-y-6">

        <div className="flex justify-center">
          <div className="relative h-36 w-36">

            {/* Outer Circle */}
            <div className="absolute inset-0 rounded-full border-8 border-slate-800" />

            {/* Progress Ring */}
            <div
              className={`absolute bottom-0 left-0 h-full rounded-full transition-all duration-700 ${progressColor}`}
              style={{
                width: `${percentage}%`,
                opacity: 0.18,
              }}
            />

            {/* Number */}
            <div
              className={`flex h-full items-center justify-center text-5xl font-bold transition-all duration-300 ${numberColor} ${
                timeLeft <= 5 ? "animate-pulse" : ""
              }`}
            >
              {timeLeft}
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-slate-400">
            Seconds Remaining
          </p>
        </div>

      </div>
    </BattleCard>
  );
}