import { Chat, ChatLocal } from "../../shared/types/all.ts";
import { mockChats } from "../mockData/chat.ts";
import { getUserById } from "./userService.ts";

const MOCK_DELAY_MS = 50;
async function delay() {
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
        otherUserName: otherUser?.userName ?? "Unknown", //implicit fallback, do i throw here?
        unreadCount: 0, // how shold this be calculated
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

// Creates a new chat between two users
export async function createChat(userId: string, otherUserId: string, listingImage?: string): Promise<Chat> {
  await delay();
  const newChat: Chat = {
    id: `CH${String(mockChats.length + 1).padStart(4, "0")}`,
    user1Id: userId,
    user2Id: otherUserId,
    isActiveTrade: false,
    totalMessageCount: 0,
    listingImage,
  };

  mockChats.push(newChat);
  return newChat;
}
