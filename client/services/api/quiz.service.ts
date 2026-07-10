import api from "./axios";

export interface CreateQuizData {
  classroom_id: number;
  title: string;
  description?: string;
  time_limit: number;
  total_marks: number;
}

export interface CreateQuizResponse {
  success: boolean;
  message: string;
}

export const createQuiz = async (
  data: CreateQuizData
): Promise<CreateQuizResponse> => {
  const response = await api.post(
    "/quizzes/create",
    data
  );

  return response.data;
};