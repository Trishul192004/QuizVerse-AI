export interface AIQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface AIQuizResponse {
  success: boolean;
  quizId: number;
  data: {
    questions: AIQuestion[];
  };
}