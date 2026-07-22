"use client";

import StudentQuiz from "@/components/quiz/StudentQuiz";

interface Props {
  params: {
    quizId: string;
  };
}

export default function StudentQuizPage({ params }: Props) {
  return (
    <div className="container mx-auto py-8">
      <StudentQuiz quizId={Number(params.quizId)} />
    </div>
  );
}