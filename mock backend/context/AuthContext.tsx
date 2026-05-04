import React, { createContext, useContext, useState } from "react";
import { mockAuth } from "../services/mockAuth";

interface AuthContextValue {
  userId: string | null;
  isLoggedIn: boolean;
  login: (id: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(mockAuth.getId());

  function login(id: string) {
    mockAuth.login(id);
    setUserId(id);
  }

  function logout() {
    mockAuth.logout();
    setUserId(null);
  }

  return (
    <AuthContext.Provider value={{ userId, isLoggedIn: userId !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
