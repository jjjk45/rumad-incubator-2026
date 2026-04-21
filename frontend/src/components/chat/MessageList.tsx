import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/colors';
import { ChatBubble } from './ChatBubble';
import { Message } from '../../types/chat';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      inverted
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <ChatBubble
          message={item}
          isUser={item.senderId === currentUserId}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: Spacing.md,
  },
});
