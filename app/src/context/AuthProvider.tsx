import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { type ReactNode, useEffect, useState } from "react";
import { firebaseAuth, googleAuthProvider } from "../config/firebase";
import type { AuthState } from "../types/auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        if (user) {
          setAuthState({
            user: {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            },
            error: null,
            loading: false,
          });
        } else {
          setAuthState({ user: null, error: null, loading: false });
        }
      },
      (error) => {
        setAuthState({ user: null, error: error.message, loading: false });
      }
    );
    return () => unsubscribe();
  }, []);

  const signWithGoogle = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      await signInWithPopup(firebaseAuth, googleAuthProvider);
    } catch (erro) {
      const message = erro instanceof Error ? erro.message : "Erro ao tentar logar.";
      console.error(erro);
      setAuthState((prev) => ({ ...prev, loading: false, error: message }));
    }
  };

  const signOut = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      await firebaseSignOut(firebaseAuth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, signWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};