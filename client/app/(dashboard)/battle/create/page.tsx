"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { saveAIQuiz } from "@/services/api/ai.service";
import {
  createBattle,
  generateBattleQuiz,
} from "@/services/api/battle.service";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BattleQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export default function CreateBattlePage() {
  const router = useRouter();

  // ==========================
  // Battle Settings
  // ==========================
  const [battleTitle, setBattleTitle] = useState("");
  const [battleDescription, setBattleDescription] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(20);
  const [creating, setCreating] = useState(false);

  // ==========================
  // AI Quiz Settings
  // ==========================
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [timer, setTimer] = useState(30);

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<BattleQuestion[]>([]);

  // ==========================
  // Generate AI Quiz
  // ==========================
  const handleGenerate = async () => {
    try {
      setLoading(true);

      const response = await generateBattleQuiz({
        topic,
        difficulty,
        questionCount,
        timer,
      });

      setQuestions(response.questions);
    } catch (error) {
      console.error(error);
      alert("Failed to generate battle questions.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Create Battle
  // ==========================
  const handleCreateBattle = async () => {
    if (questions.length === 0) {
      alert("Generate AI questions first.");
      return;
    }

    if (!battleTitle.trim()) {
      alert("Enter a battle title.");
      return;
    }

    try {
      setCreating(true);

      // Save Quiz
      const quizResponse = await saveAIQuiz({
        title: battleTitle,
        description: battleDescription,
        time_limit: timer,
        questions,
      });

      const quizId = quizResponse.quizId;

      // Create Battle Room
      const battleResponse = await createBattle({
        quizId,
        maxPlayers,
      });

      const roomCode = battleResponse.room.roomCode;

      router.push(`/battle/waiting/${roomCode}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create battle.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      {/* ==========================
          AI Quiz Generator
      ========================== */}

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            ⚔️ Create Battle
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Topic</Label>

            <Input
              placeholder="Operating Systems"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Difficulty</Label>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Question Count</Label>

              <Input
                type="number"
                min={5}
                max={30}
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(Number(e.target.value))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Timer (Seconds)</Label>

            <Input
              type="number"
              value={timer}
              onChange={(e) =>
                setTimer(Number(e.target.value))
              }
            />
          </div>

          <Button
            className="w-full"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading
              ? "Generating AI Questions..."
              : "Generate AI Questions"}
          </Button>
        </CardContent>
      </Card>

      {/* ==========================
          Battle Settings
      ========================== */}

      <Card>
        <CardHeader>
          <CardTitle>Battle Settings</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <Label>Battle Title</Label>

            <Input
              value={battleTitle}
              onChange={(e) =>
                setBattleTitle(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Description</Label>

            <Input
              value={battleDescription}
              onChange={(e) =>
                setBattleDescription(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Maximum Players</Label>

            <Input
              type="number"
              min={2}
              max={100}
              value={maxPlayers}
              onChange={(e) =>
                setMaxPlayers(Number(e.target.value))
              }
            />
          </div>

          <Button
            className="w-full"
            onClick={handleCreateBattle}
            disabled={creating}
          >
            {creating
              ? "Creating Battle..."
              : "Create Battle"}
          </Button>
        </CardContent>
      </Card>

      {/* ==========================
          Generated Questions
      ========================== */}

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Generated Questions
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {questions.map((question, index) => (
              <div
                key={index}
                className="rounded-xl border p-5"
              >
                <h3 className="mb-4 font-semibold">
                  Q{index + 1}. {question.question}
                </h3>

                <div className="space-y-2">
                  {question.options.map(
                    (option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="rounded-md border p-3"
                      >
                        {option}
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}