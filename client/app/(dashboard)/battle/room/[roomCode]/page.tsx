"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BattleRoomPage() {
  const params = useParams();

  const roomCode = params.roomCode as string;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO:
    // Load battle room data here
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold">
          Loading Battle...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">
        Battle Room
      </h1>

      <div className="rounded-lg border p-6">
        <p className="text-lg">
          <strong>Room Code:</strong> {roomCode}
        </p>

        <p className="mt-4 text-gray-600">
          Battle started successfully.
        </p>
      </div>
    </div>
  );
}