"use client";

import { Trophy } from "lucide-react";

import BattleCard from "./BattleCard";

interface LeaderboardPlayer {
  student_id?: number;
  username: string;
  score: number;
}

interface BattleLeaderBoardProps {
  leaderboard: LeaderboardPlayer[];
}

export default function BattleLeaderBoard({
  leaderboard,
}: BattleLeaderBoardProps) {
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <BattleCard
      title="Live Leaderboard"
      icon={<Trophy className="h-5 w-5" />}
    >
      {leaderboard.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 py-10 text-center text-slate-400">
          No scores available yet.
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((player, index) => (
            <div
              key={player.student_id ?? `${player.username}-${index}`}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4 transition-all duration-300 hover:border-yellow-500"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">
                  {medals[index] ?? "🏅"}
                </div>

                <div>
                  <p className="font-semibold text-white">
                    {player.username}
                  </p>

                  <p className="text-sm text-slate-400">
                    Rank #{index + 1}
                  </p>
                </div>
              </div>

              <div className="rounded-full bg-amber-500/20 px-4 py-2 font-bold text-amber-300">
                {player.score} pts
              </div>
            </div>
          ))}
        </div>
      )}
    </BattleCard>
  );
}