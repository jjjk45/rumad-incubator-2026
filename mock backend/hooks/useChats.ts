import { useCallback, useEffect, useState } from "react";
import { Chat, ChatLocal } from "../../shared/types/all.ts";
import {
  fetchChatsForUser,
  fetchChatById,
  fetchChatWithUser,
  postCreateChat,
  patchTradeStatus,
} from "../api/chatsApi.ts";
import { ApiError } from "../api/errors.ts";

export function useChats() {
  const [chats, setChats] = useState<ChatLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    fetchChatsForUser()
      .then(setChats)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { chats, loading, error, isUnauthorized: error?.status === 401 };
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
  const [chat, setChat] = useState<Chat | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    fetchChatWithUser(otherUserId)
      .then((existing) => existing ?? postCreateChat(otherUserId, listingImage))
      .then(setChat)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [otherUserId, listingImage]);

  return { chat, loading, error, isUnauthorized: error?.status === 401 };
}

export function useUpdateTradeStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const updateStatus = useCallback(
    async (chatId: string, status: Chat['tradeStatus']): Promise<Chat> => {
      setLoading(true);
      setError(null);
      try {
        return await patchTradeStatus(chatId, status);
      } catch (err) {
        setError(err as ApiError);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateStatus, loading, error };
}
