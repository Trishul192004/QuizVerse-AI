  import api from "./axios";

  /*
  ========================================
  INTERFACES
  ========================================
  */

  export interface StudentClassroom {
    id: number;
    name: string;
    join_code: string;
    teacher_name: string;
    created_at: string;
  }

  export interface JoinClassroomResponse {
    success: boolean;
    message: string;
  }

  export interface StudentClassroomsResponse {
    success: boolean;
    classrooms: StudentClassroom[];
  }

  export interface QuizQuestion {
    id: number;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    marks: number;
  }

  export interface AttemptQuiz {
    id: number;
    quiz_id: number;
    title: string;
    description: string;
    status: string;
    time_limit: number;
    total_marks: number;
  }

export interface AttemptQuizResponse {
  success: boolean;
  attempt: AttemptQuiz;
  questions: QuizQuestion[];
}

  /*
  ========================================
  JOIN CLASSROOM
  ========================================
  */

  export const joinClassroom = async (
    join_code: string
  ): Promise<JoinClassroomResponse> => {
    const response = await api.post("/student/join-classroom", {
      join_code,
    });

    return response.data;
  };

  /*
  ========================================
  GET MY CLASSROOMS
  ========================================
  */

  export const getStudentClassrooms =
    async (): Promise<StudentClassroomsResponse> => {
      const response = await api.get("/student/classrooms");
      return response.data;
    };

  /*
  ========================================
  GET CLASSROOM QUIZZES
  ========================================
  */

  export const getStudentClassroomQuizzes = async (
    classroomId: number
  ) => {
    const response = await api.get(
      `/student/classrooms/${classroomId}/quizzes`
    );

    return response.data;
  };

  /*
  ========================================
  START QUIZ
  ========================================
  */

  export const startQuiz = async (quizId: number) => {
    const response = await api.post(
      `/student/start-quiz/${quizId}`
    );

    return response.data;
  };

  /*
  ========================================
  GET ATTEMPT QUIZ
  ========================================
  */

  export const getAttemptQuiz = async (
    attemptId: number
  ): Promise<AttemptQuizResponse> => {
    const response = await api.get(
      `/student/attempt/${attemptId}`
    );

    return response.data;
  };

  /*
  ========================================
  SUBMIT QUIZ
  ========================================
  */

  export const submitQuiz = async (
    attemptId: number,
    answers: {
      question_id: number;
      selected_option: string;
    }[]
  ) => {
    const response = await api.post(
      `/student/submit/${attemptId}`,
      {
        answers,
      }
    );

    return response.data;
  };