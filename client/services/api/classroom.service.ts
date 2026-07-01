import api from "./axios";

/*
========================================
INTERFACES
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
POST /api/classroom/create
========================================
*/

export const createClassroom = async (
  data: CreateClassroomData
): Promise<CreateClassroomResponse> => {

  const response = await api.post(
    "/classroom/create",
    data
  );

  return response.data;

};

/*
========================================
GET TEACHER CLASSROOMS
GET /api/classroom
========================================
*/

export const getTeacherClassrooms =
async (): Promise<GetTeacherClassroomsResponse> => {

  const response =
    await api.get("/classroom");

  return response.data;

};

/*
========================================
DELETE CLASSROOM
DELETE /api/classroom/:id
========================================
*/

export const deleteClassroom =
async (
  id: number
): Promise<DeleteClassroomResponse> => {

  const response =
    await api.delete(
      `/classroom/${id}`
    );

  return response.data;

};