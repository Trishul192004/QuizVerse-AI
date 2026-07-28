"use client";

import { User } from "lucide-react";

import BattleCard from "./BattleCard";

interface Player {
  id?: number;
  username: string;
  score?: number;
}

interface BattlePlayerProps {
  players: Player[];
}

export default function BattlePlayer({
  players,
}: BattlePlayerProps) {
  return (
    <BattleCard
      title="Players"
      icon={<User className="h-5 w-5" />}
    >
      {players.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 py-10 text-center text-slate-400">
          Waiting for players to join...
        </div>
      ) : (
        <div className="space-y-3">
          {players.map((player, index) => (
            <div
              key={player.id ?? `${player.username}-${index}`}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4 transition-all duration-300 hover:border-indigo-500 hover:bg-slate-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 font-bold text-white">
                  {player.username.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="font-semibold text-white">
                    {player.username}
                  </p>

                  <p className="text-sm text-slate-400">
                    Ready to battle
                  </p>
                </div>
              </div>

              <div className="rounded-full bg-indigo-600/20 px-4 py-2 font-semibold text-indigo-300">
                {player.score ?? 0} pts
              </div>
            </div>
          ))}
        </div>
      )}
    </BattleCard>
  );
}