"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BattleResultCard from "@/components/battle/BattleResultCard";
import {
  getBattleLeaderboard,
  getBattleRoom,
} from "@/services/api/battle.service";

export default function BattleResultPage() {
  const params = useParams();
  const router = useRouter();

  const roomCode = params.roomCode as string;

  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  async function loadResults() {
    try {
      const roomRes = await getBattleRoom(roomCode);
      const leaderboardRes = await getBattleLeaderboard(roomCode);

      setRoom(roomRes.room);
      setLeaderboard(leaderboardRes.leaderboard);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResults();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-8 py-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white">
            Loading Results...
          </h2>
        </div>
      </div>
    );
  }

  const winner = leaderboard[0];

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <BattleResultCard
        roomCode={roomCode}
        winner={winner}
        leaderboard={leaderboard}
        onBack={() => router.push("/battle")}
      />
    </div>
  );
}