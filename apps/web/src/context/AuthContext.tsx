import React, { createContext, useReducer, useEffect, useCallback } from "react";
import { authApi } from "../api/auth.api";
import type { User } from "../types";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: "SET_USER"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_USER":
      return { user: action.payload, isAuthenticated: true, isLoading: false };
    case "LOGOUT":
      return { user: null, isAuthenticated: false, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const init = useCallback(async () => {
    try {
      await authApi.refresh();
      const user = await authApi.getMe();
      dispatch({ type: "SET_USER", payload: user });
    } catch {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const login = async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    dispatch({ type: "SET_USER", payload: result.user });
    return result.user;
  };

  const logout = async () => {
    await authApi.logout();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
