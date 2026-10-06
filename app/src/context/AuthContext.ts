import { createContext } from "react";
import type { AuthState } from "../types/auth";

export interface AuthContextType {
  authState: AuthState;
  signWithGoogle: () => Promise<void>;   // ← troca signIn por signWithGoogle
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);