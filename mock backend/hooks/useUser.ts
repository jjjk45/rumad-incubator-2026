import { useCallback, useState, useEffect } from "react";
import { User, UserPublic, UpdateUserInput } from "../../shared/types/all.ts";
import { fetchMe, fetchUserById, fetchAllUsers, patchMe } from "../api/usersApi.ts";
import { ApiError } from "../api/errors.ts";

// Full profile - only use for the logged-in user's own data
export function useCurrentUser() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, error, isUnauthorized: error?.status === 401 };
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

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const update = useCallback(async (input: UpdateUserInput): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      return await patchMe(input);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}
