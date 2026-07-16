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

/*
========================================
JOIN CLASSROOM
========================================
*/

export const joinClassroom = async (
  join_code: string
): Promise<JoinClassroomResponse> => {

  const response = await api.post(
    "/student/join-classroom",
    {
      join_code,
    }
  );

  return response.data;
};

/*
========================================
GET MY CLASSROOMS
========================================
*/

export const getStudentClassrooms = async (): Promise<StudentClassroomsResponse> => {

  const response = await api.get(
    "/student/classrooms"
  );

  return response.data;
};