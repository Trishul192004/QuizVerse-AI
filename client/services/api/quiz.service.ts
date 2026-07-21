import api from "./axios";

export interface CreateQuizData {
  classroom_id: number;
  title: string;
  description?: string;
  time_limit: number;
  total_marks: number;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  time_limit: number;
  total_marks: number;
  total_questions?: number;
  created_at: string;
}

export const createQuiz = async (data: CreateQuizData) => {
  const response = await api.post("/quizzes/create", data);
  return response.data;
};

export const getClassroomQuizzes = async (
  classroomId: number
) => {
  const response = await api.get(
    `/quizzes/classroom/${classroomId}`
  );

  return response.data;
};

export const getQuizById = async (
  quizId: number
) => {
  const response = await api.get(
    `/quizzes/${quizId}`
  );

  return response.data;
};

export const deleteQuiz = async (
  quizId: number
) => {
  const response = await api.delete(
    `/quizzes/${quizId}`
  );

  return response.data;
};

export const updateQuiz = async (
  quizId: number,
  data: any
) => {
  const response = await api.put(
    `/quizzes/${quizId}`,
    data
  );

  return response.data;
};