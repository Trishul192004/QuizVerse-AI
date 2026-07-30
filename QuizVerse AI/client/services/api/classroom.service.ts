import api from "./axios";

/*
========================================
CLASSROOM INTERFACES
========================================
*/

export interface Classroom {
  id: number;
  name: string;
  join_code: string;
  created_at: string;
}

export interface CreateClassroomData {
  name: string;
}

export interface CreateClassroomResponse {
  success: boolean;
  message: string;

  classroom?: {
    id: number;
    name: string;
    joinCode: string;
  };
}

export interface GetTeacherClassroomsResponse {
  success: boolean;
  classrooms: Classroom[];
}

export interface DeleteClassroomResponse {
  success: boolean;
  message: string;
}

/*
========================================
CREATE CLASSROOM
POST /api/classrooms/create
========================================
*/

export const createClassroom = async (
  data: CreateClassroomData
): Promise<CreateClassroomResponse> => {
  const response = await api.post(
    "/classrooms/create",
    data
  );

  return response.data;
};

/*
========================================
GET TEACHER CLASSROOMS
GET /api/classrooms
========================================
*/

export const getTeacherClassrooms = async (): Promise<GetTeacherClassroomsResponse> => {
  const response = await api.get(
    "/classrooms"
  );

  return response.data;
};

/*
========================================
DELETE CLASSROOM
DELETE /api/classrooms/:id
========================================
*/

export const deleteClassroom = async (
  id: number
): Promise<DeleteClassroomResponse> => {
  const response = await api.delete(
    `/classrooms/${id}`
  );

  return response.data;
};

/*
========================================
JOIN CLASSROOM
POST /api/classrooms/join
========================================
*/

export interface JoinClassroomData {
  joinCode: string;
}

export interface JoinClassroomResponse {
  success: boolean;
  message: string;
}

export const joinClassroom = async (
  data: JoinClassroomData
): Promise<JoinClassroomResponse> => {
  const response = await api.post(
    "/classrooms/join",
    data
  );

  return response.data;
};

/*
========================================
GET STUDENT CLASSROOMS
GET /api/classrooms/student
========================================
*/

export interface StudentClassroom {
  id: number;
  name: string;
  join_code: string;
  created_at: string;
}

export interface GetStudentClassroomsResponse {
  success: boolean;
  classrooms: StudentClassroom[];
}

export const getStudentClassrooms = async (): Promise<GetStudentClassroomsResponse> => {
  const response = await api.get(
    "/classrooms/student"
  );

  return response.data;
};

/*
========================================
GET SINGLE CLASSROOM
GET /api/classrooms/:id
========================================
*/

export interface ClassroomDetails {
  id: number;
  name: string;
  join_code: string;
  created_at: string;
  students: number;
}

export interface GetClassroomResponse {
  success: boolean;
  classroom: ClassroomDetails;
}

export const getClassroom = async (
  id: number
): Promise<GetClassroomResponse> => {
  const response = await api.get(
    `/classrooms/${id}`
  );

  return response.data;
};

/*
========================================
QUIZ INTERFACES
========================================
*/

export interface Quiz {
  id: number;
  title: string;
  description: string;
  time_limit: number;
  total_marks: number;
  created_at: string;
}

export interface GetClassroomQuizzesResponse {
  success: boolean;
  quizzes: Quiz[];
}

/*
========================================
GET QUIZZES OF A CLASSROOM
GET /api/quizzes/classroom/:classroomId
========================================
*/

export const getClassroomQuizzes = async (
  classroomId: number
): Promise<GetClassroomQuizzesResponse> => {
  const response = await api.get(
    `/quizzes/classroom/${classroomId}`
  );

  return response.data;
};