import { Conversation, Message, User } from '../types/chat';

export const MOCK_USERS: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    name: 'John Doe',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-1',
  },
  'user-2': {
    id: 'user-2',
    name: 'Jane Smith',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-2',
  },
  'user-3': {
    id: 'user-3',
    name: 'Bob Wilson',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-3',
  },
};

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'user-2',
      text: 'Hi! Is the iPhone 13 still available?',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      senderId: 'user-1',
      text: 'Yes, it is! Are you interested?',
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      senderId: 'user-2',
      text: 'Yes, would you take $500 for it?',
      createdAt: new Date().toISOString(),
    },
  ],
  'conv-2': [
    {
      id: 'msg-4',
      conversationId: 'conv-2',
      senderId: 'user-3',
      text: 'Hey, I saw your listing for the bike.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'msg-5',
      conversationId: 'conv-2',
      senderId: 'user-1',
      text: 'Hi Bob! Yeah, it is in great condition.',
      createdAt: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    },
  ],
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participants: [MOCK_USERS['user-1'], MOCK_USERS['user-2']],
    lastMessage: MOCK_MESSAGES['conv-1'][MOCK_MESSAGES['conv-1'].length - 1],
    updatedAt: new Date().toISOString(),
    itemId: 'item-1',
  },
  {
    id: 'conv-2',
    participants: [MOCK_USERS['user-1'], MOCK_USERS['user-3']],
    lastMessage: MOCK_MESSAGES['conv-2'][MOCK_MESSAGES['conv-2'].length - 1],
    updatedAt: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    itemId: 'item-2',
  },
];
