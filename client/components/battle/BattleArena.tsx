"use client";

import { Swords } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BattleArena() {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <Swords className="h-6 w-6 text-red-500" />
            Battle Arena
          </h2>

          <p className="mt-2 text-slate-400">
            Create a real-time multiplayer quiz battle for your students.
          </p>
        </div>

        <button
          onClick={() => router.push("/teacher/battle/create")}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Create Battle
        </button>
      </div>
    </div>
  );
}