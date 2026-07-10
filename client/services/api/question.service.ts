import api from "./axios";

/*
========================================
INTERFACES
========================================
*/

export interface Question {
  id: number;
  question: string;

  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;

  correct_option: "A" | "B" | "C" | "D";

  marks: number;

  created_at: string;
}

export interface CreateQuestionData {
  quiz_id: number;

  question: string;

  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;

  correct_option: "A" | "B" | "C" | "D";

  marks: number;
}

export interface UpdateQuestionData {

  question: string;

  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;

  correct_option: "A" | "B" | "C" | "D";

  marks: number;
}

export interface QuestionResponse {
  success: boolean;
  message: string;
}

export interface QuestionsResponse {

  success: boolean;

  questions: Question[];

}

/*
========================================
CREATE QUESTION
========================================
*/

export const createQuestion = async (
  data: CreateQuestionData
): Promise<QuestionResponse> => {

  const response = await api.post(
    "/questions/create",
    data
  );

  return response.data;
};

/*
========================================
GET QUESTIONS OF QUIZ
========================================
*/

export const getQuestionsByQuiz = async (
  quizId: number
): Promise<QuestionsResponse> => {

  const response = await api.get(
    `/questions/quiz/${quizId}`
  );

  return response.data;
};

/*
========================================
UPDATE QUESTION
========================================
*/

export const updateQuestion = async (
  id: number,
  data: UpdateQuestionData
): Promise<QuestionResponse> => {

  const response = await api.put(
    `/questions/${id}`,
    data
  );

  return response.data;
};

/*
========================================
DELETE QUESTION
========================================
*/

export const deleteQuestion = async (
  id: number
): Promise<QuestionResponse> => {

  const response = await api.delete(
    `/questions/${id}`
  );

  return response.data;
};