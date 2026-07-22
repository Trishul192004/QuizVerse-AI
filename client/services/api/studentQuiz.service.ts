import api from "./axios";

export const getQuizById = async (quizId: number) => {
  const res = await api.get(`/quiz/${quizId}`);
  return res.data;
};

export const submitQuiz = async (
  quizId: number,
  payload: {
    answers: {
      questionId: number;
      answer: string;
    }[];
  }
) => {
  const res = await api.post(
    `/quiz/${quizId}/submit`,
    payload
  );

  return res.data;
};

export const getQuizResult = async (quizId: number) => {
  const res = await api.get(
    `/quiz/${quizId}/result`
  );

  return res.data;
};

export const getAvailableQuizzes = async () => {
  const res = await api.get("/quiz/student");

  return res.data;
};