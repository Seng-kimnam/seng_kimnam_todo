import { createContext, useContext } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  register: (
    username: string,
    email: string,
    password: string,
  ) => { success: boolean; message: string };
  login: (
    identifier: string,
    password: string,
  ) => { success: boolean; message: string };
  logout: () => void;
  resetPassword: (
    email: string,
    newPassword: string,
  ) => { success: boolean; message: string };
  updateProfile: (updates: Partial<Pick<User, "username" | "email">>) => {
    success: boolean;
    message: string;
  };
}

export const USERS_KEY = "todo_app_users";
export const SESSION_KEY = "todo_app_session";

export function readUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

export function writeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function readCurrentUser(): User | null {
  const userId = localStorage.getItem(SESSION_KEY);
  if (!userId) return null;
  return readUsers().find((u) => u.id === userId) ?? null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
