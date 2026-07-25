"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold">
          Loading Results...
        </h2>
      </div>
    );
  }

  const winner = leaderboard[0];

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">

      <div className="border rounded-lg p-8 text-center shadow">

        <h1 className="text-4xl font-bold mb-6">
          🎉 Battle Finished
        </h1>

        <p className="text-lg">
          Room Code
        </p>

        <p className="text-2xl font-bold mb-4">
          {roomCode}
        </p>

        {winner && (
          <>
            <h2 className="text-2xl font-semibold">
              🏆 Winner
            </h2>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {winner.username}
            </p>

            <p className="text-xl mt-2">
              {winner.score} Points
            </p>
          </>
        )}

      </div>

      <div className="border rounded-lg p-6 shadow">

        <h2 className="text-2xl font-bold mb-6">
          Final Leaderboard
        </h2>

        {leaderboard.map((player: any, index: number) => (

          <div
            key={player.id}
            className="flex justify-between border-b py-4"
          >

            <div>

              <span className="font-bold mr-2">
                #{index + 1}
              </span>

              <span>
                {player.username}
              </span>

            </div>

            <div className="font-semibold">
              {player.score} pts
            </div>

          </div>

        ))}

      </div>

      <div className="flex justify-center">

        <button
          onClick={() => router.push("/battle")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Back to Battles
        </button>

      </div>

    </div>
  );
}