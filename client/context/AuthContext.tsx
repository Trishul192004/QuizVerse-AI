"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

import {
  AuthContextType,
  User,
} from "@/types/auth";

/*
========================================
AUTH CONTEXT
========================================
*/

export const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

interface Props {
  children: ReactNode;
}

/*
========================================
AUTH PROVIDER
========================================
*/

export function AuthProvider({
  children,
}: Props) {
  /*
  ========================================
  INITIAL STATE
  ========================================
  */

  const [token, setToken] = useState<string | null>(
    () => {
      if (typeof window === "undefined") {
        return null;
      }

      return localStorage.getItem("token");
    }
  );

  const [user, setUser] =
    useState<User | null>(() => {
      if (typeof window === "undefined") {
        return null;
      }

      const savedUser =
        localStorage.getItem("user");

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    });

  /*
  ========================================
  LOGIN
  ========================================
  */

  const login = (
    accessToken: string,
    refreshToken: string,
    newUser: User
  ) => {
    localStorage.setItem(
      "token",
      accessToken
    );

    localStorage.setItem(
      "refreshToken",
      refreshToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(newUser)
    );

    setToken(accessToken);

    setUser(newUser);
  };

  /*
  ========================================
  LOGOUT
  ========================================
  */

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem(
      "refreshToken"
    );

    localStorage.removeItem("user");

    setToken(null);

    setUser(null);
  };

  /*
  ========================================
  CONTEXT VALUE
  ========================================
  */

  const value = useMemo(
    () => ({
      user,

      token,

      loading: false,

      isAuthenticated: !!token,

      login,

      logout,
    }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/*
========================================
CUSTOM HOOK
========================================
*/

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}