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

/*
========================================
CREATE QUESTION
========================================
*/

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

export interface CreateQuestionResponse {
  success: boolean;

  message: string;

  question?: {
    id: number;
  };
}

/*
========================================
GET QUESTIONS
========================================
*/

export interface QuestionsResponse {
  success: boolean;

  questions: Question[];
}

/*
========================================
UPDATE QUESTION
========================================
*/

export interface UpdateQuestionData {
  question: string;

  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;

  correct_option: "A" | "B" | "C" | "D";

  marks: number;
}

export interface UpdateQuestionResponse {
  success: boolean;

  message: string;
}

/*
========================================
DELETE QUESTION
========================================
*/

export interface DeleteQuestionResponse {
  success: boolean;

  message: string;
}

/*
========================================
CREATE QUESTION
POST /api/questions/create
========================================
*/

export const createQuestion = async (
  data: CreateQuestionData
): Promise<CreateQuestionResponse> => {

  const response = await api.post(
    "/questions/create",
    data
  );

  return response.data;
};

/*
========================================
GET QUESTIONS OF QUIZ
GET /api/questions/quiz/:quizId
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
PUT /api/questions/:id
========================================
*/

export const updateQuestion = async (
  id: number,
  data: UpdateQuestionData
): Promise<UpdateQuestionResponse> => {

  const response = await api.put(
    `/questions/${id}`,
    data
  );

  return response.data;
};

/*
========================================
DELETE QUESTION
DELETE /api/questions/:id
========================================
*/

export const deleteQuestion = async (
  id: number
): Promise<DeleteQuestionResponse> => {

  const response = await api.delete(
    `/questions/${id}`
  );

  return response.data;
};