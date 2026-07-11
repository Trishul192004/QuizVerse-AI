import api from "./axios";

/*
========================================
TYPES
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

export interface QuestionResponse {
  success: boolean;
  questions: Question[];
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

/*
========================================
GET QUESTIONS
========================================
*/

export const getQuestions = async (
  quizId: number
): Promise<QuestionResponse> => {
  const response =
    await api.get<QuestionResponse>(
      `/questions/quiz/${quizId}`
    );

  return response.data;
};

/*
========================================
CREATE QUESTION
========================================
*/

export const createQuestion = async (
  data: CreateQuestionData
) => {
  const response =
    await api.post(
      "/questions/create",
      data
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
) => {
  const response =
    await api.put(
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
) => {
  const response =
    await api.delete(
      `/questions/${id}`
    );

  return response.data;
};