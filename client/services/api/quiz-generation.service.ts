import api from "./axios";

export interface GenerateQuizRequest {
  classroomId: number;
  documentId: number;
  questionType: string;
  difficulty: string;
  numberOfQuestions: number;
  timeLimit: number;
}

export async function generateAIQuiz(
  payload: GenerateQuizRequest
) {
  const { data } = await api.post(
    "/rag/generate-quiz",
    payload
  );

  return data;
}