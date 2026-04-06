import { Chat } from "../../shared/types/all";

const Chat1: Chat = {
  id: "CH0001",
  user1Id: "0001",
  user2Id: "0011",
  lastMessageId: "MSG0003",
  lastMessageTime: 1743520000000,
  listingImage: "miniFridge1.jpg",
  totalMessageCount: 3,
};

const Chat2: Chat = {
  id: "CH0002",
  user1Id: "0001",
  user2Id: "0100",
  lastMessageId: "MSG0011",
  lastMessageTime: 1743610000000,
  tradeStatus: "pending",
  listingImage: "ti84_front.jpg",
  totalMessageCount: 8,
};

const Chat3: Chat = {
  id: "CH0003",
  user1Id: "0011",
  user2Id: "0101",
  lastMessageId: "MSG0025",
  lastMessageTime: 1743700000000,
  tradeStatus: "accepted",
  listingImage: "orchem1.jpg",
  totalMessageCount: 14,
};

const Chat4: Chat = {
  id: "CH0004",
  user1Id: "0100",
  user2Id: "0101",
  totalMessageCount: 0,
};

export const mockChats: Chat[] = [Chat1, Chat2, Chat3, Chat4];
