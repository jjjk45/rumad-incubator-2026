import { useEffect, useState } from "react";
import { Chat, ChatLocal } from "../../shared/types/all.ts";
import {
  fetchChatsForUser,
  fetchChatById,
  fetchChatWithUser,
  postCreateChat,
} from "../api/chatsApi.ts";
import { ApiError } from "../api/errors.ts";
import { useAuth } from "./authHook.ts";

export function useChats() {
  const { userId } = useAuth();
  const [chats, setChats] = useState<ChatLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetchChatsForUser(userId)
      .then(setChats)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { chats, loading, error, isUnauthorized: !userId };
}

export function useChat(id: string) {
  const [chat, setChat] = useState<Chat | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    fetchChatById(id)
      .then(setChat)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { chat, loading, error, notFound: error?.status === 404 };
}

// Looks up an existing chat with a user, or creates one if it doesn't exist
export function useOrCreateChat(otherUserId: string, listingImage?: string) {
  const { userId } = useAuth();
  const [chat, setChat] = useState<Chat | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetchChatWithUser(userId, otherUserId)
      .then((existing) => existing ?? postCreateChat(userId, otherUserId, listingImage))
      .then(setChat)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId, otherUserId]);

  return { chat, loading, error, isUnauthorized: !userId };
}
