"use client";

import {
  Swords,
  Users,
  Hash,
  BookOpen,
} from "lucide-react";

import BattleCard from "./BattleCard";

interface BattleHeaderProps {
  roomCode: string;
  status?: string;
  playerCount: number;
  currentQuestion: number;
}

export default function BattleHeader({
  roomCode,
  status,
  playerCount,
  currentQuestion,
}: BattleHeaderProps) {
  const isLive = status === "active";

  return (
    <BattleCard className="overflow-hidden">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-8 text-white">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}
          <div>
            <div className="flex items-center gap-3">
              <Swords className="h-8 w-8" />

              <h1 className="text-4xl font-bold">
                Battle Arena
              </h1>
            </div>

            <p className="mt-2 text-indigo-100">
              Compete in real-time and climb the leaderboard.
            </p>
          </div>

          {/* Status Badge */}
          <div
            className={`rounded-full px-5 py-2 text-sm font-semibold shadow-lg ${
              isLive
                ? "bg-green-500 text-white"
                : "bg-slate-800 text-slate-200"
            }`}
          >
            {status?.toUpperCase() ?? "WAITING"}
          </div>

        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
            <div className="mb-2 flex items-center gap-2">
              <Hash className="h-5 w-5" />
              <span className="text-sm text-indigo-100">
                Room Code
              </span>
            </div>

            <p className="text-xl font-bold tracking-widest">
              {roomCode}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm text-indigo-100">
                Players
              </span>
            </div>

            <p className="text-xl font-bold">
              {playerCount}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm text-indigo-100">
                Current Question
              </span>
            </div>

            <p className="text-xl font-bold">
              {currentQuestion}
            </p>
          </div>

        </div>
      </div>
    </BattleCard>
  );
}