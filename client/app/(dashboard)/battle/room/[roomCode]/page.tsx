"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

  // Server sends ONE current question
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

    console.log("ROOM:", roomRes);
    console.log("PLAYERS:", playersRes);
    console.log("QUESTION RESPONSE:", questionRes);
    console.log("LEADERBOARD:", leaderboardRes);

    setRoom(roomRes.room);
    setPlayers(playersRes.players);
    setLeaderboard(leaderboardRes.leaderboard);

    if (questionRes.completed) {
      router.push(`/battle/result/${roomCode}`);
      return;
    }

    console.log("QUESTION:", questionRes.question);

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

  // Refresh every 2 seconds
  useEffect(() => {
    const interval = setInterval(loadBattle, 2000);

    return () => clearInterval(interval);
  }, []);

  // Reset timer whenever server sends a new question
useEffect(() => {
  if (!question) return;

  setTimeLeft(30);
  setSelectedOption("");
  setSubmitted(false);
}, [question?.id]);

  // Countdown timer
useEffect(() => {

    if (!question) return;

    if (submitted) return;

    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {

        setTimeLeft(prev => prev - 1);

    },1000);

    return ()=>clearTimeout(timer);

},[timeLeft, submitted, question]);

  useEffect(() => {

    if (timeLeft > 0) return;

    if (!question) return;

    if (submitted) return;

    console.log("⏰ Timer expired");

    handleSubmit(true);

}, [timeLeft]);

async function handleSubmit(autoSubmit = false) {

  if (!question) return;

  if (submitted) return;

  console.log("=== HANDLE SUBMIT ===");

  console.log({
    roomCode,
    questionId: question.id,
    selectedOption,
    responseTime: (30 - timeLeft) * 1000,
  });

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

    if (res.result?.battleCompleted) {
      router.push(`/battle/result/${roomCode}`);
      return;
    }

    await loadBattle();

  } catch (err) {

    console.error(err);

    // Allow retry if submission actually failed
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

    return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">

      {/* Room Information */}
      <div className="border rounded-lg p-5 shadow-sm">

        <h1 className="text-3xl font-bold">
          ⚔️ Battle Room
        </h1>

        <div className="grid grid-cols-2 gap-4 mt-5">

          <div>
            <p className="text-gray-500">Room Code</p>
            <p className="font-semibold">{roomCode}</p>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-semibold capitalize">
              {room?.status}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Question</p>
            <p className="font-semibold">
              {(room?.currentQuestionIndex ?? 0) + 1}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Players</p>
            <p className="font-semibold">
              {players.length}
            </p>
          </div>

        </div>

      </div>

      {/* Timer */}
      <div className="border rounded-lg p-5 text-center shadow-sm">

        <h2 className="text-xl font-semibold mb-2">
          Time Remaining
        </h2>

        <p className="text-5xl font-bold">
          {timeLeft}s
        </p>

      </div>

      {/* Players */}
      <div className="border rounded-lg p-5 shadow-sm">

        <h2 className="text-xl font-semibold mb-4">
          Players
        </h2>

        {players.map((player: any) => (

          <div
            key={player.id}
            className="flex justify-between border-b py-3"
          >

            <span>{player.username}</span>

            <span className="font-semibold">
              {player.score} pts
            </span>

          </div>

        ))}

      </div>

      {/* Current Question */}
      {question && (

        <div className="border rounded-lg p-6 shadow-sm">

          <h2 className="text-2xl font-bold mb-6">
            {question.question}
          </h2>

          {["A", "B", "C", "D"].map((option) => (

            <button
              key={option}
              onClick={() => setSelectedOption(option)}
              className={`w-full text-left border rounded-lg p-4 mb-4 transition
              ${
                selectedOption === option
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >

              <span className="font-semibold mr-2">
                {option}.
              </span>

              {question[`option_${option.toLowerCase()}`]}

            </button>

          ))}

            <button
            onClick={handleSubmit}
            disabled={!selectedOption || submitted}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
            >
            {submitted ? "Waiting for next question..." : "Submit Answer"}
            </button>

        </div>

      )}

      {/* Leaderboard */}
      <div className="border rounded-lg p-5 shadow-sm">

        <h2 className="text-xl font-semibold mb-4">
          🏆 Live Leaderboard
        </h2>

        {leaderboard.length === 0 ? (

          <p>No players yet.</p>

        ) : (

          leaderboard.map((player: any, index: number) => (

            <div
              key={player.id}
              className="flex justify-between border-b py-3"
            >

              <span>

                {index === 0 && "🥇 "}
                {index === 1 && "🥈 "}
                {index === 2 && "🥉 "}

                {player.username}

              </span>

              <span className="font-semibold">
                {player.score} pts
              </span>

            </div>

          ))

        )}

      </div>

    </div>
  );
}