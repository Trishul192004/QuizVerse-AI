export interface QuizSummary {
  total_students: number;
  submitted: number;
  pending: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
}

export interface StudentAttempt {
  attempt_id: number;
  student_id: number;
  username: string;
  score: number;
  total_marks: number;
  status: string;
  started_at: string;
  submitted_at: string | null;
}

export interface TeacherQuizAnalytics {
  success: boolean;

  quiz: {
    id: number;
    classroom_id: number;
    title: string;
    total_marks: number;
  };

  summary: QuizSummary;

  students: StudentAttempt[];
}