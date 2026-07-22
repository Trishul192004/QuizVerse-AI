import api from "./axios";

/*
=================================
GET AVAILABLE QUIZZES
=================================
*/
export const getAvailableQuizzes = async () => {
  const res = await api.get("/student/quizzes");
  return res.data;
};

/*
=================================
GET QUIZ
=================================
*/
export const getQuizById = async (quizId: number) => {
  const res = await api.get(`/student/quizzes/${quizId}`);
  return res.data;
};

/*
=================================
START QUIZ
=================================
*/
export const startQuiz = async (quizId: number) => {
  const res = await api.post(
    `/student/quizzes/${quizId}/start`
  );

  return res.data;
};

/*
=================================
SUBMIT QUIZ
=================================
*/
export const submitQuiz = async (
  quizId: number,
  payload: {
    attemptId: number;
    answers: {
      question_id: number;
      selected_option: "A" | "B" | "C" | "D";
    }[];
  }
) => {
  const res = await api.post(
    `/student/quizzes/${quizId}/submit`,
    payload
  );

  return res.data;
};

/*
=================================
RESULT
=================================
*/
export const getQuizResult = async (
  attemptId: number
) => {
  const res = await api.get(
    `/student/attempt/${attemptId}/result`
  );

  return res.data;
  };