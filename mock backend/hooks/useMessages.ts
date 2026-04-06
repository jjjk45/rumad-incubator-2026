import { useCallback, useEffect, useState } from "react";
import { Message } from "../../shared/types/all.ts";
import {
  fetchMessagesByChatId,
  postCreateMessage,
  postMarkMessagesAsRead,
} from "../api/messagesApi.ts";
import { ApiError } from "../api/errors.ts";

export function useMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchMessagesByChatId(chatId)
      .then(setMessages)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [chatId]);

  const sendMessage = useCallback(
    async (content: string) => {
      setSending(true);
      try {
        const newMessage = await postCreateMessage(chatId, { content });
        setMessages((prev) => [...prev, newMessage]);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setSending(false);
      }
    },
    [chatId]
  );

  return { messages, loading, error, sendMessage, sending };
}

export function useMarkAsRead(chatId: string): void {
  useEffect(() => {
    postMarkMessagesAsRead(chatId).catch(console.warn);
  }, [chatId]);
}
