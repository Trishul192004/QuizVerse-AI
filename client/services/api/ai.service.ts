import axios from "./axios";

export interface GenerateQuizRequest {
  classroom_id: number;
  title: string;
  description: string;
  time_limit: number;

  topic: string;
  difficulty: string;
  questionCount: number;
  type: string;
}

export interface AIQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  marks?: number;
}

export async function generateQuizPreview(
  data: GenerateQuizRequest
) {
  const res = await axios.post(
    "/ai/generate-quiz-preview",
    data
  );

  return res.data;
}

export async function saveAIQuiz(data: {
  classroom_id: number;
  title: string;
  description: string;
  time_limit: number;
  questions: AIQuestion[];
}) {
  const res = await axios.post(
    "/quizzes/save-ai",
    data
  );

  return res.data;
}