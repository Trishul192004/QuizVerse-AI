"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Swords,
  Users,
  Crown,
  Play,
  CheckCircle2,
  Hash,
} from "lucide-react";

import {
  getBattlePlayers,
  getBattleRoom,
  startBattle,
} from "@/services/api/battle.service";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Player {
  id: number;
  username: string;
  score: number;
}

interface BattleRoom {
  roomCode: string;
  status: string;
  maxPlayers: number;
  currentPlayers: number;
  hostId: number;
}

export default function WaitingRoomPage() {
  const router = useRouter();
  const { roomCode } = useParams();

  const [room, setRoom] = useState<BattleRoom | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    setUserId(user.id);

    loadRoom();

    const interval = setInterval(() => {
      loadRoom();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  async function loadRoom() {
    try {
      const roomRes = await getBattleRoom(roomCode as string);
      const playerRes = await getBattlePlayers(roomCode as string);

      setRoom(roomRes.room);
      setPlayers(playerRes.players);

      if (roomRes.room.status === "active") {
        router.push(`/battle/room/${roomCode}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStartBattle() {
    try {
      console.log("========== START BUTTON CLICKED ==========");
      console.log("Logged in User ID:", userId);
      console.log("Host ID:", room?.hostId);
      console.log("Room Code:", roomCode);

      await startBattle({
        roomCode: roomCode as string,
      });

      router.push(`/battle/room/${roomCode}`);
    } catch (err) {
      console.error(err);
      alert("Unable to start battle.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Card className="border-slate-800 bg-slate-900 px-10 py-8 shadow-2xl">
          <div className="flex flex-col items-center gap-5">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <h2 className="text-xl font-semibold text-white">
              Loading Waiting Room...
            </h2>
          </div>
        </Card>
      </div>
    );
  }

  const percentage =
    room && room.maxPlayers > 0
      ? (players.length / room.maxPlayers) * 100
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 py-10">

      <div className="mx-auto max-w-5xl space-y-8">

        {/* Hero */}

        <Card className="overflow-hidden border-slate-800 bg-slate-900 shadow-2xl">

          <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-10 text-center">

            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white/15 backdrop-blur">
              <Swords className="h-12 w-12 text-white" />
            </div>

            <h1 className="text-5xl font-bold text-white">
              Waiting Room
            </h1>

            <p className="mt-4 text-lg text-indigo-100">
              Waiting for all players to join before the battle begins.
            </p>

          </div>

          <CardContent className="space-y-8 p-8">

            {/* Room Code */}

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center">

              <div className="mb-3 flex justify-center">
                <Hash className="h-6 w-6 text-indigo-400" />
              </div>

              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Room Code
              </p>

              <h2 className="mt-2 text-5xl font-extrabold tracking-[0.35em] text-white">
                {room?.roomCode}
              </h2>

            </div>

            {/* Progress */}

            <div>

              <div className="mb-3 flex items-center justify-between">

                <div className="flex items-center gap-2 text-white">
                  <Users className="h-5 w-5 text-indigo-400" />
                  <span className="font-semibold">
                    Players Joined
                  </span>
                </div>

                <span className="font-bold text-indigo-400">
                  {players.length}/{room?.maxPlayers}
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />

              </div>

            </div>

            {/* Players */}

            <div className="space-y-4">              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-all duration-300 hover:border-indigo-500 hover:bg-slate-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-lg font-bold text-white">
                      {player.username.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {player.username}
                      </h3>

                      <p className="text-sm text-slate-400">
                        Battle Participant
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">
                      Ready
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Host Controls */}

            {userId === room?.hostId ? (
              <div className="space-y-5">

                <div className="flex items-center justify-center gap-2 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 py-4 text-yellow-400">
                  <Crown className="h-5 w-5" />
                  <span className="font-semibold">
                    You are the Host
                  </span>
                </div>

                <Button
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-lg font-semibold transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleStartBattle}
                  disabled={players.length < 2}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Battle
                </Button>

                {players.length < 2 && (
                  <p className="text-center text-sm text-slate-400">
                    At least <span className="font-semibold text-white">2 players</span> are required to start the battle.
                  </p>
                )}

              </div>
            ) : (
              <div className="space-y-4">

                <Button
                  disabled
                  className="h-14 w-full rounded-2xl bg-slate-800 text-lg"
                >
                  Waiting for Host...
                </Button>

                <div className="flex justify-center gap-2">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>

                <p className="text-center text-sm text-slate-400">
                  The host will start the battle soon...
                </p>

              </div>
            )}

          </CardContent>

        </Card>

      </div>

    </div>
  );
  }