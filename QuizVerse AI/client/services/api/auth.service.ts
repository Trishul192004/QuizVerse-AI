import api from "./axios";

import { User } from "@/types/auth";

/*
========================================
REQUEST TYPES
========================================
*/

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: "teacher" | "student";
}

/*
========================================
RESPONSE TYPES
========================================
*/

export interface LoginResponse {
  success: boolean;
  message: string;

  accessToken: string;
  refreshToken: string;

  user: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface CurrentUserResponse {
  success: boolean;
  user: User;
}

/*
========================================
LOGIN
========================================
*/

export const login = async (
  data: LoginData
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    data
  );

  return response.data;
};

/*
========================================
REGISTER
========================================
*/

export const register = async (
  data: RegisterData
): Promise<RegisterResponse> => {
  const response =
    await api.post<RegisterResponse>(
      "/auth/register",
      data
    );

  return response.data;
};

/*
========================================
CURRENT USER
========================================
*/

export const getCurrentUser =
  async (): Promise<CurrentUserResponse> => {
    const response =
      await api.get<CurrentUserResponse>(
        "/auth/me"
      );

    return response.data;
  };