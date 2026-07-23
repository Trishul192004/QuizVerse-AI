"use client";

import { useEffect, useState } from "react";
import { getLeaderboard } from "@/services/api/student.service";

interface LeaderboardUser {
  user_rank: number;
  id: number;
  username: string;
  avatar_url: string | null;
  xp: number;
  coins: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data.leaderboard);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        🏆 Leaderboard
      </h1>

      <table className="w-full border rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Rank</th>
            <th className="p-3">Username</th>
            <th className="p-3">XP</th>
            <th className="p-3">Coins</th>
          </tr>
        </thead>

        <tbody>
          {leaderboard.map((user) => (
            <tr
              key={user.id}
              className="text-center border-t"
            >
              <td className="p-3">{user.user_rank}</td>
              <td className="p-3">{user.username}</td>
              <td className="p-3">{user.xp}</td>
              <td className="p-3">{user.coins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}