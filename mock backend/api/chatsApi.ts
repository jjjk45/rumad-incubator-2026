import { Chat, ChatLocal } from "../../shared/types/all";
import {
  getChatsForUser,
  getChatById,
  getChatWithUser,
  createChat,
  updateTradeStatus,
} from "../services/chatService";
import { ApiError } from "./errors";
import { mockAuth } from "../services/mockAuth";

// GET /chats
export async function fetchChatsForUser(): Promise<ChatLocal[]> {
  const userId = mockAuth.getId();
  if (!userId) throw new ApiError(401, "Unauthorized");
  return getChatsForUser(userId);
}

// GET /chats/:id
export async function fetchChatById(id: string): Promise<Chat> {
  const chat = await getChatById(id);
  if (!chat) throw new ApiError(404, `Chat ${id} not found`);
  return chat;
}

// GET /chats?otherUserId=:otherUserId
export async function fetchChatWithUser(otherUserId: string): Promise<Chat | undefined> {
  const userId = mockAuth.getId();
  if (!userId) throw new ApiError(401, "Unauthorized");
  return getChatWithUser(userId, otherUserId);
}

// POST /chats
export async function postCreateChat(otherUserId: string, listingImage?: string): Promise<Chat> {
  const userId = mockAuth.getId();
  if (!userId) throw new ApiError(401, "Unauthorized");
  return createChat(userId, otherUserId, listingImage);
}

// PATCH /chats/:chatId/trade-status
export async function patchTradeStatus(chatId: string, status: Chat['tradeStatus']): Promise<Chat> {
  const userId = mockAuth.getId();
  if (!userId) throw new ApiError(401, "Unauthorized");
  return updateTradeStatus(chatId, userId, status);
}
