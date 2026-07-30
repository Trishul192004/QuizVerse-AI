import axios from "@/lib/axios";

export async function generateQuiz(data: {
  topic: string;
  difficulty: string;
  questionCount: number;
  type: string;
}) {
  const res = await axios.post("/ai/generate-quiz", data);

  return res.data;
}