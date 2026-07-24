import api from "./axios";
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

export async function generateBattleQuiz(
  data: GenerateBattleQuizRequest
) {
  const res = await axios.post("/battle-ai/generate", data);
  return res.data;
}

export async function createBattle(
  data: CreateBattleRequest
) {
  const res = await axios.post("/battle/create", data);
  return res.data;
}



export async function getBattleRoom(roomCode: string) {
  const res = await axios.get(`/battle/${roomCode}`);
  return res.data;
}

export async function getBattlePlayers(roomCode: string) {
  const res = await axios.get(
    `/battle/${roomCode}/players`
  );

  return res.data;
}

export async function getBattleQuestions(roomCode: string) {
  const res = await axios.get(
    `/battle/${roomCode}/questions`
  );

  return res.data;
}

export async function submitBattleAnswer(data: any) {
  const res = await axios.post(
    "/battle/submit-answer",
    data
  );

  return res.data;
}

export async function getBattleLeaderboard(roomCode: string) {
  const res = await axios.get(
    `/battle/${roomCode}/leaderboard`
  );

  return res.data;
}

export async function joinBattle(data: JoinBattleRequest) {
  const res = await axios.post("/battle/join", data);
  return res.data;
}
export async function startBattle(data: { roomCode: string }) {
  const res = await axios.post("/battle/start", data);
  return res.data;
}