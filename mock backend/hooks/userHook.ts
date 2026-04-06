import { useState, useEffect } from "react";
import { User, UserPublic } from "../../shared/types/all.ts";
import { fetchMe, fetchUserById, fetchAllUsers } from "../api/usersApi.ts";
import { ApiError } from "../api/errors.ts";
import { useAuth } from "./authHook.ts";

// Full profile - only use for the logged-in user's own data
export function useCurrentUser() {
  const { userId } = useAuth();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetchMe(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error, isUnauthorized: !userId };
}

// Public profile — use when viewing another user (e.g. seller on a listing)
export function useUserById(id: string) {
  const [user, setUser] = useState<UserPublic | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    fetchUserById(id)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { user, loading, error, notFound: error?.status === 404 };
}

// Returns public profiles
export function useAllUsers() {
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    fetchAllUsers()
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { users, loading, error };
}
