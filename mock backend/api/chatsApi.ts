import { Chat, ChatLocal } from "../../shared/types/all.ts";
import {
  getChatsForUser,
  getChatById,
  getChatWithUser,
  createChat,
} from "../services/chatService.ts";
import { ApiError } from "./errors.ts";

// Real backend equivalent: GET /chats
export async function fetchChatsForUser(userId: string): Promise<ChatLocal[]> {
  return getChatsForUser(userId);
}

// Real backend equivalent: GET /chats/:id
export async function fetchChatById(id: string): Promise<Chat> {
  const chat = await getChatById(id);
  if (!chat) throw new ApiError(404, `Chat ${id} not found`);
  return chat;
}

// Real backend equivalent: GET /chats?otherUserId=:otherUserId
export async function fetchChatWithUser(userId: string, otherUserId: string): Promise<Chat | undefined> {
  return getChatWithUser(userId, otherUserId);
}

// Real backend equivalent: POST /chats
export async function postCreateChat(userId: string, otherUserId: string, listingImage?: string): Promise<Chat> {
  return createChat(userId, otherUserId, listingImage);
}
