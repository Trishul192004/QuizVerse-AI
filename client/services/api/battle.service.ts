import axios from "./axios";

export interface GenerateBattleQuizRequest {
  topic: string;
  difficulty: string;
  questionCount: number;
  timer: number;
}

export interface CreateBattleRequest {
  quizId: number;
  maxPlayers: number;
}

export interface JoinBattleRequest {
  roomCode: string;
}

export interface BattlePlayer {
  id: number;
  username: string;
  score: number;
}

export interface BattleQuestion {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  marks: number;
}

export interface BattleRoom {
  roomId: number;
  roomCode: string;
  hostId: number;
  quizId: number;
  maxPlayers: number;
  currentPlayers: number;
  currentQuestionIndex: number;
  status: string;
  createdAt?: string;
  startedAt?: string;
  endedAt?: string;
}

/* ==========================================================
   GENERATE AI QUIZ
========================================================== */

export async function generateBattleQuiz(
  data: GenerateBattleQuizRequest
) {
  const res = await axios.post("/battle-ai/generate", data);
  return res.data;
}

/* ==========================================================
   CREATE BATTLE
========================================================== */

export async function createBattle(
  data: CreateBattleRequest
) {
  const res = await axios.post("/battle/create", data);
  return res.data;
}

/* ==========================================================
   JOIN BATTLE
========================================================== */

export async function joinBattle(
  data: JoinBattleRequest
) {
  const res = await axios.post("/battle/join", data);
  return res.data;
}

/* ==========================================================
   START BATTLE
========================================================== */

export async function startBattle(
  data: { roomCode: string }
) {
  const res = await axios.post("/battle/start", data);
  return res.data;
}

/* ==========================================================
   GET ROOM
========================================================== */

export async function getBattleRoom(
  roomCode: string
) {
  const res = await axios.get(`/battle/${roomCode}`);

  return res.data as {
    success: boolean;
    room: BattleRoom;
  };
}

/* ==========================================================
   GET PLAYERS
========================================================== */

export async function getBattlePlayers(
  roomCode: string
) {
  const res = await axios.get(
    `/battle/${roomCode}/players`
  );

  return res.data as {
    success: boolean;
    players: BattlePlayer[];
  };
}

/* ==========================================================
   GET CURRENT QUESTION
========================================================== */

export async function getBattleQuestions(
  roomCode: string
) {
  const res = await axios.get(
    `/battle/${roomCode}/questions`
  );

  return res.data as {
    completed: boolean;
    currentQuestionIndex?: number;
    question?: BattleQuestion;
  };
}

/* ==========================================================
   SUBMIT ANSWER
========================================================== */

export async function submitBattleAnswer(
  data: {
    roomCode: string;
    questionId: number;
    selectedOption: string;
    responseTime: number;
  }
) {
  const res = await axios.post(
    "/battle/submit-answer",
    data
  );

  return res.data;
}

/* ==========================================================
   LEADERBOARD
========================================================== */

export async function getBattleLeaderboard(
  roomCode: string
) {
  const res = await axios.get(
    `/battle/${roomCode}/leaderboard`
  );

  return res.data as {
    status: string;
    leaderboard: BattlePlayer[];
  };
}