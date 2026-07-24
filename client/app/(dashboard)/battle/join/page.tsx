"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="mx-auto max-w-lg py-10">
      <Card>
        <CardHeader>
          <CardTitle>Join Battle</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Input
            placeholder="ABC123"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleJoin}
          >
            Join Battle
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}