import { Message, SendMessageInput } from "../../shared/types/all.ts";
import {
  getMessagesByChatId,
  createMessage,
  markMessagesAsRead,
} from "../services/messageService.ts";
import { ApiError } from "./errors.ts";
import { mockAuth } from "../services/mockAuth.ts";

// GET /chats/:chatId/messages
export async function fetchMessagesByChatId(chatId: string): Promise<Message[]> {
  const userId = mockAuth.getId();
  if (!userId) throw new ApiError(401, "Unauthorized");
  return getMessagesByChatId(chatId, userId);
}

// POST /chats/:chatId/messages
export async function postCreateMessage(
  chatId: string,
  input: SendMessageInput
): Promise<Message> {
  const senderId = mockAuth.getId();
  if (!senderId) throw new ApiError(401, "Unauthorized");
  return createMessage(chatId, senderId, input.content);
}

// POST /chats/:chatId/messages/read
export async function postMarkMessagesAsRead(chatId: string): Promise<void> {
  const userId = mockAuth.getId();
  if (!userId) throw new ApiError(401, "Unauthorized");
  return markMessagesAsRead(chatId, userId);
}
