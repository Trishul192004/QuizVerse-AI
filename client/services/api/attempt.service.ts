import api from "./axios";
import { AttemptResponse } from "@/types/attempt";

export const getAttemptDetails = async (
  attemptId: number
): Promise<AttemptResponse> => {
  const response = await api.get(
    `/teacher/attempts/${attemptId}`
  );

  return response.data;
};