import api from "./axios";

export interface StudentQuiz {
  id: number;
  title: string;
  classroom_id: number;
  classroom_name: string;
  question_count: number;
  time_limit: number;
  created_at: string;
}

export const getPublishedQuizzes = async (): Promise<StudentQuiz[]> => {
  const response = await api.get("/student/quizzes");
  return response.data.data;
};


export interface StartQuizResponse {
  attemptId: number;
  resumed: boolean;
}

export const startQuiz = async (
  quizId: number
): Promise<StartQuizResponse> => {
  const response = await api.post(`/student/start-quiz/${quizId}`);
  return response.data;
};