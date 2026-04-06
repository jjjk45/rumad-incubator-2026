import { Chat } from "../../shared/types/all.ts";

export const mockChats: Chat[] = [];

const Chat1: Chat = {
  id: "CH0001",
  user1Id: "0001",
  user2Id: "0011",
  lastMessage: "Is the fridge still available?",
  lastMessageTime: 1743520000000,
  isActiveTrade: false,
  listingImage: "miniFridge1.jpg",
  totalMessageCount: 3,
};

const Chat2: Chat = {
  id: "CH0002",
  user1Id: "0001",
  user2Id: "0100",
  lastMessage: "I can do $70 for the calculator.",
  lastMessageTime: 1743610000000,
  isActiveTrade: true,
  tradeStatus: "pending",
  listingImage: "ti84_front.jpg",
  totalMessageCount: 8,
};

const Chat3: Chat = {
  id: "CH0003",
  user1Id: "0011",
  user2Id: "0101",
  lastMessage: "Can we meet at the Busch student center?",
  lastMessageTime: 1743700000000,
  isActiveTrade: true,
  tradeStatus: "accepted",
  listingImage: "orchem1.jpg",
  totalMessageCount: 14,
};

const Chat4: Chat = {
  id: "CH0004",
  user1Id: "0100",
  user2Id: "0101",
  lastMessage: undefined,
  isActiveTrade: false,
  totalMessageCount: 0,
};

mockChats.push(Chat1, Chat2, Chat3, Chat4);
