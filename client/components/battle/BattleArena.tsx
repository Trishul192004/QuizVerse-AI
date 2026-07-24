"use client";

import { useRouter } from "next/navigation";
import { Swords, Users } from "lucide-react";

export default function BattleArena() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          ⚔️ Battle Arena
        </h1>

        <p className="mt-2 text-slate-400">
          Create or join real-time AI-powered quiz battles.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <Swords className="mb-4 h-10 w-10 text-red-500" />

          <h2 className="text-2xl font-bold text-white">
            Create Battle
          </h2>

          <p className="mt-2 text-slate-400">
            Generate an AI quiz and invite players using a room code.
          </p>

          <button
            onClick={() => router.push("/battle/create")}
            className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Create Battle
          </button>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <Users className="mb-4 h-10 w-10 text-green-500" />

          <h2 className="text-2xl font-bold text-white">
            Join Battle
          </h2>

          <p className="mt-2 text-slate-400">
            Join an existing multiplayer battle using a room code.
          </p>

          <button
            onClick={() => router.push("/battle/join")}
            className="mt-6 w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Join Battle
          </button>
        </div>
      </div>
    </div>
  );
}