"use client";

import { Trophy, Medal, RotateCcw } from "lucide-react";

interface BattleResultCardProps {
  roomCode: string;
  winner: any;
  leaderboard: any[];
  onBack: () => void;
}

export default function BattleResultCard({
  roomCode,
  winner,
  leaderboard,
  onBack,
}: BattleResultCardProps) {
const getMedal = (index: number) => {
  switch (index) {
    case 0:
      return "🥇";
    case 1:
      return "🥈";
    case 2:
      return "🥉";
    default:
      return "🏅";
  }
};
  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* Hero */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 shadow-2xl">

        <div className="p-10 text-center text-white">

          <div className="mb-6 flex justify-center">
            <div className="flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-white/15 backdrop-blur">
              <Trophy className="h-12 w-12 text-yellow-300" />
            </div>
          </div>

          <h1 className="text-5xl font-bold">
            Battle Complete
          </h1>

          <p className="mt-3 text-indigo-100">
            Congratulations to everyone who participated!
          </p>

          <div className="mt-8 inline-flex rounded-full bg-white/15 px-6 py-3 text-lg font-semibold backdrop-blur">
            Room Code : {roomCode}
          </div>

        </div>
      </div>

      {/* Winner */}
      {winner && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl transition-all duration-300 hover:border-yellow-500">

          <div className="flex flex-col items-center">

            <div className="mb-5 rounded-full bg-yellow-500/20 p-6">
              <Trophy className="h-12 w-12 text-yellow-400" />
            </div>

            <p className="text-sm uppercase tracking-[0.3em] text-yellow-400">
              Champion
            </p>

            <h2 className="mt-2 text-4xl font-bold text-white">
              {winner.username}
            </h2>

            <p className="mt-3 rounded-full bg-indigo-600/20 px-6 py-2 text-lg font-semibold text-indigo-300">
              {winner.score} Points
            </p>

          </div>

        </div>
      )}

      {/* Leaderboard */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">

        <div className="border-b border-slate-800 px-8 py-6">

          <h2 className="flex items-center gap-3 text-3xl font-bold text-white">
            <Medal className="h-7 w-7 text-yellow-400" />
            Final Leaderboard
          </h2>

        </div>

        <div className="p-6 space-y-4">

          {leaderboard.map((player, index) => (

            <div
              key={player.id ?? index}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-5 transition-all duration-300 hover:border-indigo-500 hover:-translate-y-1"
            >

              <div className="flex items-center gap-5">

                <div className="text-3xl">
                  {getMedal(index)}
                </div>

                <div>

                  <h3 className="text-lg font-semibold text-white">
                    {player.username}
                  </h3>

                  <p className="text-sm text-slate-400">
                    Rank #{index + 1}
                  </p>

                </div>

              </div>

              <div className="rounded-full bg-indigo-600/20 px-5 py-2 font-bold text-indigo-300">
                {player.score} pts
              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Footer */}

      <div className="flex justify-center">

        <button
          onClick={onBack}
          className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-indigo-600/30"
        >
          <RotateCcw className="h-5 w-5" />
          Back to Battle Arena
        </button>

      </div>

    </div>
  );
}