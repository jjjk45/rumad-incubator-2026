import { Message } from "../../shared/types/all.ts";
import { mockMessages } from "../mockData/messages.ts";
import { mockChats } from "../mockData/chat.ts";
import { ApiError } from "../api/errors.ts";
import { generateId } from "../utils/generateId.ts";

const MOCK_DELAY_MS = 50; // simulate network time, we obviously wont use this in the real service
function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

function assertParticipant(chatId: string, userId: string): void {
  const chat = mockChats.find((c) => c.id === chatId);
  if (!chat) throw new ApiError(404, `Chat ${chatId} not found`);
  if (chat.user1Id !== userId && chat.user2Id !== userId) {
    throw new ApiError(403, "Forbidden");
  }
}

export async function getMessagesByChatId(chatId: string, userId: string): Promise<Message[]> {
  await delay();
  assertParticipant(chatId, userId);
  return mockMessages
    .filter((m) => m.chatId === chatId)
    .sort((a, b) => a.timestamp - b.timestamp);
}

export async function createMessage(
  chatId: string,
  senderId: string,
  content: string
): Promise<Message> {
  await delay();
  assertParticipant(chatId, senderId);

  const message: Message = {
    id: generateId(),
    chatId,
    senderId,
    content,
    timestamp: Date.now(),
    isRead: false,
  };
  mockMessages.push(message);

  const chat = mockChats.find((c) => c.id === chatId);
  if (chat) {
    chat.lastMessageId = message.id;
    chat.lastMessageTime = message.timestamp;
    chat.totalMessageCount += 1;
  }

  return message;
}

export async function markMessagesAsRead(
  chatId: string,
  userId: string
): Promise<void> {
  await delay();
  assertParticipant(chatId, userId);
  mockMessages
    .filter((m) => m.chatId === chatId && m.senderId !== userId)
    .forEach((m) => { m.isRead = true; });
}
