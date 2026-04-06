import { Chat, ChatLocal } from "../../shared/types/all";
import { mockChats } from "../mockData/chat";
import { mockMessages } from "../mockData/messages";
import { getUserById } from "./userService";
import { ApiError } from "../api/errors";
import { generateId } from "../utils/generateId";

const MOCK_DELAY_MS = 50; // simulate network time, we obviously wont use this in the real service
function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

// Returns all chats for a user as ChatLocal
export async function getChatsForUser(userId: string): Promise<ChatLocal[]> {
  await delay();
  const userChats = mockChats.filter((c) => c.user1Id === userId || c.user2Id === userId);

  const chatLocals = await Promise.all(
    userChats.map(async (chat): Promise<ChatLocal> => {
      const otherUserId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
      const otherUser = await getUserById(otherUserId);
      return {
        ...chat,
        otherUserId,
        otherUserName: otherUser?.userName ?? "Unknown",
        unreadCount: mockMessages.filter(
          (m) => m.chatId === chat.id && m.senderId !== userId && !m.isRead
        ).length,
      };
    })
  );

  return chatLocals.sort((a, b) => (b.lastMessageTime ?? 0) - (a.lastMessageTime ?? 0));
}

export async function getChatById(id: string): Promise<Chat | undefined> {
  await delay();
  return mockChats.find((c) => c.id === id);
}

// Finds an existing chat between two users, or returns undefined
export async function getChatWithUser(userId: string, otherUserId: string): Promise<Chat | undefined> {
  await delay();
  return mockChats.find(
    (c) =>
      (c.user1Id === userId && c.user2Id === otherUserId) ||
      (c.user1Id === otherUserId && c.user2Id === userId)
  );
}

// Creates a new chat between two users, or returns the existing one
export async function createChat(userId: string, otherUserId: string, listingImage?: string): Promise<Chat> {
  await delay();
  const existing = mockChats.find(
    (c) =>
      (c.user1Id === userId && c.user2Id === otherUserId) ||
      (c.user1Id === otherUserId && c.user2Id === userId)
  );
  if (existing) return existing;

  const newChat: Chat = {
    id: generateId(),
    user1Id: userId,
    user2Id: otherUserId,
    totalMessageCount: 0,
    listingImage,
  };

  mockChats.push(newChat);
  return newChat;
}

export async function updateTradeStatus(
  chatId: string,
  userId: string,
  status: Chat['tradeStatus']
): Promise<Chat> {
  await delay();
  const chat = mockChats.find((c) => c.id === chatId);
  if (!chat) throw new ApiError(404, `Chat ${chatId} not found`);
  if (chat.user1Id !== userId && chat.user2Id !== userId) {
    throw new ApiError(403, "Forbidden");
  }
  chatadeStatus = status;
  return chat;
}
