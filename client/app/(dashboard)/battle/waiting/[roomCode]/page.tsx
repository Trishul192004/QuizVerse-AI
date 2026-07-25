"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getBattlePlayers,
  getBattleRoom,
  startBattle,
} from "@/services/api/battle.service";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  return (

    <div className="mx-auto max-w-4xl py-10">

      <Card>

        <CardHeader>
          <CardTitle className="text-3xl">
            ⚔ Waiting Room
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <div>

            <p>Room Code</p>

            <div className="rounded-lg bg-slate-900 p-5 text-center text-4xl font-bold text-white">

              {room?.roomCode}

            </div>

          </div>

          <div>

            <h2 className="text-xl font-semibold">

              Players ({players.length}/{room?.maxPlayers})

            </h2>

            <div className="space-y-3 mt-3">

              {players.map((player) => (

                <div
                  key={player.id}
                  className="flex justify-between border rounded-lg p-4"
                >

                  <span>{player.username}</span>

                  <span className="text-green-600">
                    Ready
                  </span>

                </div>

              ))}

            </div>

          </div>

          {userId === room?.hostId ? (

            <Button
              className="w-full"
              onClick={handleStartBattle}
              disabled={players.length < 2}
            >

              🚀 Start Battle

            </Button>

          ) : (

            <Button
              disabled
              className="w-full"
            >

              Waiting for Host...

            </Button>

          )}

        </CardContent>

      </Card>

    </div>

  );

}