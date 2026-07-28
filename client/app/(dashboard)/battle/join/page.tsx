"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Swords, ArrowRight, Hash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { joinBattle } from "@/services/api/battle.service";

export default function JoinBattlePage() {
  const router = useRouter();

  const [roomCode, setRoomCode] = useState("");

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      alert("Enter room code.");
      return;
    }

    try {
      await joinBattle({
        roomCode: roomCode.toUpperCase(),
      });

      router.push(`/battle/waiting/${roomCode.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      alert("Unable to join battle.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6">
      <Card className="w-full max-w-lg overflow-hidden border-slate-800 bg-slate-900 shadow-2xl">

        {/* Hero */}
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-10 text-center">

          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <Swords className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white">
            Join Battle
          </h1>

          <p className="mt-3 text-indigo-100">
            Enter the room code shared by the host and compete in real-time.
          </p>

        </div>

        <CardContent className="space-y-8 p-8">

          <div className="space-y-3">

            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Hash className="h-4 w-4" />
              Battle Room Code
            </label>

            <Input
              placeholder="ABC123"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="h-12 rounded-xl border-slate-700 bg-slate-950 text-center text-xl font-bold uppercase tracking-[0.25em] text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
            />

          </div>

          <Button
            className="h-12 w-full rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-lg font-semibold transition-all duration-300 hover:scale-[1.02]"
            onClick={handleJoin}
          >
            Join Battle
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}