"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import BattleHeader from "@/components/battle/BattleHeader";
import BattleTimer from "@/components/battle/BattleTimer";
import BattlePlayer from "@/components/battle/BattlePlayer";
import BattleQuestion from "@/components/battle/BattleQuestion";
import BattleLeaderBoard from "@/components/battle/BattleLeaderBoard";

import {
  getBattleRoom,
  getBattlePlayers,
  getBattleQuestions,
  getBattleLeaderboard,
  submitBattleAnswer,
} from "@/services/api/battle.service";

export default function BattleRoomPage() {
  const params = useParams();
  const router = useRouter();

  const roomCode = params.roomCode as string;

  const [loading, setLoading] = useState(true);

  const [room, setRoom] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [question, setQuestion] = useState<any>(null);

  const [selectedOption, setSelectedOption] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  async function loadBattle() {
    try {
      const roomRes = await getBattleRoom(roomCode);
      const playersRes = await getBattlePlayers(roomCode);
      const questionRes = await getBattleQuestions(roomCode);
      const leaderboardRes = await getBattleLeaderboard(roomCode);

      setRoom(roomRes.room);
      setPlayers(playersRes.players || []);
      setLeaderboard(leaderboardRes.leaderboard || []);

      if (questionRes.completed) {
        router.push(`/battle/result/${roomCode}`);
        return;
      }

      setQuestion(questionRes.question);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBattle();
  }, []);

   useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket Connected:", socket.id);

      socket.emit("battle:join", {
        roomCode,
        username: localStorage.getItem("username") || "Player",
      });
    });

    socket.on("battle:player-list", ({ players }) => {
      console.log("👥 Players:", players);
      setPlayers(players);
    });

    socket.on("battle:update-leaderboard", ({ leaderboard }) => {
      console.log("🏆 Leaderboard Updated");
      setLeaderboard(leaderboard);
    });

    socket.on("battle:new-question", (data) => {
      console.log("📖 New Question:", data);
      console.log("Received Question ID:", data.question.id);
      console.log("Current Question ID:", question?.id);
      console.log("CLIENT GOT:", data.question.id);


      setQuestion(data.question);
      setSelectedOption("");
      setSubmitted(false);
      setTimeLeft(30);
    });

    socket.on("battle:timer", ({ remaining }) => {
      setTimeLeft(remaining);
    });

    socket.on("battle:finished", () => {
      router.push(`/battle/result/${roomCode}`);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket Error:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("battle:player-list");
      socket.off("battle:update-leaderboard");
      socket.off("battle:new-question");
      socket.off("battle:timer");
      socket.off("battle:finished");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [roomCode]);

    // Reset state whenever a new question arrives
  useEffect(() => {
    if (!question) return;

    setSelectedOption("");
    setSubmitted(false);
    setTimeLeft(30);
  }, [question?.id]);

  // Local countdown (server timer updates will override this if received)
  useEffect(() => {
    if (!question) return;
     if (submitted) return;
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [question, submitted, timeLeft]);

  // Auto submit when timer expires
  useEffect(() => {
      if (!question) return;
    if (submitted) return;
     if (timeLeft > 0) return;

     console.log("⏰ Timer expired");
    handleSubmit(true);
  }, [timeLeft]);

  async function handleSubmit(autoSubmit = false) {
    if (!question) return;
    if (submitted) return;

    if (!selectedOption && !autoSubmit) {
      alert("Please select an option");
      return;
    }

    try {
      setSubmitted(true);

      const res = await submitBattleAnswer({
        roomCode,
        questionId: question.id,
        selectedOption: selectedOption || "",
        responseTime: (30 - timeLeft) * 1000,
      });

      console.log("Answer Response:", res);

      if (res?.result?.battleCompleted) {
        router.push(`/battle/result/${roomCode}`);
        return;
      }
    } catch (err) {
      console.error(err);

      // Allow retry if request fails
      setSubmitted(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold">
          Loading Battle...
        </h2>
      </div>
    );
  }

  console.log("Players:", players);
  console.log("Leaderboard:", leaderboard);

return (
  <div className="mx-auto max-w-7xl space-y-8 p-8">

    <BattleHeader
      roomCode={roomCode}
      status={room?.status}
      playerCount={players.length}
      currentQuestion={(room?.currentQuestionIndex ?? 0) + 1}
    />

    <BattleTimer
      timeLeft={timeLeft}
    />

    <div className="grid gap-8 xl:grid-cols-3">

      <div className="space-y-8 xl:col-span-2">

        <BattleQuestion
          question={question}
          selectedOption={selectedOption}
          submitted={submitted}
          onSelect={setSelectedOption}
          onSubmit={() => handleSubmit()}
        />

      </div>

      <div className="space-y-8">

        <BattlePlayer
          players={players}
        />

        <BattleLeaderBoard
          leaderboard={leaderboard}
        />

      </div>

    </div>

  </div>
);
};
