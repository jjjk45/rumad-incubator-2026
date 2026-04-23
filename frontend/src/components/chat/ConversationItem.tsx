import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../constants/colors';
import { Conversation } from '../../types/chat';

interface ConversationItemProps {
  conversation: Conversation;
  onPress: () => void;
}

export function ConversationItem({ conversation, onPress }: ConversationItemProps) {
  // Find the other participant (not the current user - assuming user-1 is current user for mock)
  const otherParticipant = conversation.participants.find(
    (p) => p.id !== 'user-1'
  ) || conversation.participants[0];

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: otherParticipant.avatarUrl }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{otherParticipant.name}</Text>
          <Text style={styles.time}>{formatTime(conversation.updatedAt)}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {conversation.lastMessage.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  content: {
    gap: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  time: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  lastMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
});
