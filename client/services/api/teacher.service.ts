import api from "./axios";
import { TeacherQuizAnalytics } from "@/types/teacher";

export const getQuizAnalytics = async (
  quizId: number
): Promise<TeacherQuizAnalytics> => {
  const response = await api.get(
    `/teacher/quizzes/${quizId}/analytics`
  );

  return response.data;
};