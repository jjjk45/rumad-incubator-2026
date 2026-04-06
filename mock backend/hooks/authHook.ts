import { useState } from "react";
import { mockAuth } from "../services/mockAuth.ts";

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(mockAuth.getId());

  function login(id: string) {
    mockAuth.login(id);
    setUserId(id);
  }

  function logout() {
    mockAuth.logout();
    setUserId(null);
  }

  return { userId, isLoggedIn: userId !== null, login, logout };
}