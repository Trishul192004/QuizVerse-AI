export interface AttemptSummary {
  id: number;
  username: string;
  title: string;
  score: number;
  total_marks: number;
  started_at: string;
  submitted_at: string | null;
}

export interface AttemptQuestion {
  id: number;
  question: string;

  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;

  correct_option: "A" | "B" | "C" | "D";
  selected_option: "A" | "B" | "C" | "D" | null;

  marks: number;
  marks_awarded: number;

  explanation: string | null;

  is_correct: boolean;
}

export interface AttemptResponse {
  success: boolean;
  attempt: AttemptSummary;
  questions: AttemptQuestion[];
}