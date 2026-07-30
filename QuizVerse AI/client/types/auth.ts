/*
========================================
USER MODEL
========================================
*/

export interface User {
  id: number;

  username: string;

  email: string;

  role: "teacher" | "student" | "admin";

  xp: number;

  coins: number;
}

/*
========================================
AUTH CONTEXT
========================================
*/

export interface AuthContextType {
  user: User | null;

  token: string | null;

  loading: boolean;

  isAuthenticated: boolean;

  login: (
    accessToken: string,
    refreshToken: string,
    user: User
  ) => void;

  logout: () => void;
}